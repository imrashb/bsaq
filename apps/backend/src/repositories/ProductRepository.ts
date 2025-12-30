import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { ProductSortOptions, type Product, type Facet } from "@bsaq/types";

export class ProductRepository {
  private prisma: PrismaClient;

  constructor() {
    const adapter = new PrismaPg(
      {
        connectionString: process.env.DATABASE_URL,
      },
      {
        schema: process.env.DATABASE_SCHEMA,
      },
    );
    this.prisma = new PrismaClient({ adapter });
  }

  async upsertProduct(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        volumeMl: product.volumeMl,
        abv: product.abv,
        category: product.category,
        country: product.country,
        isAvailableInStore: product.isAvailableInStore,
        url: product.url,
        imageUrl: product.imageUrl,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        pureAlcoholMl: product.pureAlcoholMl,
        pureAlcoholPerDollar: product.pureAlcoholPerDollar,
        pureAlcoholPerOriginalDollar: product.pureAlcoholPerOriginalDollar,
      },
      create: {
        sku: product.sku,
        name: product.name,
        volumeMl: product.volumeMl,
        abv: product.abv,
        category: product.category,
        country: product.country,
        isAvailableInStore: product.isAvailableInStore,
        url: product.url,
        imageUrl: product.imageUrl,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        pureAlcoholMl: product.pureAlcoholMl,
        pureAlcoholPerDollar: product.pureAlcoholPerDollar,
        pureAlcoholPerOriginalDollar: product.pureAlcoholPerOriginalDollar,
      },
    });
  }

  private buildWhereClause(options: {
    search?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    minAbv?: number;
    maxAbv?: number;
    minPureAlcoholPerDollar?: number;
    maxPureAlcoholPerDollar?: number;
  }): Prisma.ProductWhereInput {
    const {
      search,
      categories,
      minPrice,
      maxPrice,
      minAbv,
      maxAbv,
      minPureAlcoholPerDollar,
      maxPureAlcoholPerDollar,
    } = options;
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categories && categories.length > 0) {
      where.category = { in: categories };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.currentPrice = {};
      if (minPrice !== undefined) where.currentPrice.gte = minPrice;
      if (maxPrice !== undefined) where.currentPrice.lte = maxPrice;
    }

    if (minAbv !== undefined || maxAbv !== undefined) {
      where.abv = {};
      if (minAbv !== undefined) where.abv.gte = minAbv;
      if (maxAbv !== undefined) where.abv.lte = maxAbv;
    }

    if (
      minPureAlcoholPerDollar !== undefined ||
      maxPureAlcoholPerDollar !== undefined
    ) {
      where.pureAlcoholPerDollar = {};
      if (minPureAlcoholPerDollar !== undefined)
        where.pureAlcoholPerDollar.gte = minPureAlcoholPerDollar;
      if (maxPureAlcoholPerDollar !== undefined)
        where.pureAlcoholPerDollar.lte = maxPureAlcoholPerDollar;
    }

    return where;
  }

  async findAll(options: {
    page: number;
    pageSize: number;
    sort?: string;
    search?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    minAbv?: number;
    maxAbv?: number;
    minPureAlcoholPerDollar?: number;
    maxPureAlcoholPerDollar?: number;
  }): Promise<Product[]> {
    const { page, pageSize, sort } = options;
    const skip = (page - 1) * pageSize;

    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      pureAlcoholPerDollar: "desc",
    };

    const where = this.buildWhereClause(options);

    switch (sort) {
      case ProductSortOptions.PriceAsc:
        orderBy = { currentPrice: "asc" };
        break;
      case ProductSortOptions.PriceDesc:
        orderBy = { currentPrice: "desc" };
        break;
      case ProductSortOptions.AlcoholAsc:
        orderBy = { abv: "asc" };
        break;
      case ProductSortOptions.AlcoholDesc:
        orderBy = { abv: "desc" };
        break;
      case ProductSortOptions.ValueAsc:
        orderBy = { pureAlcoholPerDollar: "asc" };
        break;
      case ProductSortOptions.ValueDesc:
        orderBy = { pureAlcoholPerDollar: "desc" };
        break;
    }

    return this.prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy,
      where,
    });
  }

  async count(options: {
    search?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    minAbv?: number;
    maxAbv?: number;
    minPureAlcoholPerDollar?: number;
    maxPureAlcoholPerDollar?: number;
  }): Promise<number> {
    const where = this.buildWhereClause(options);
    return this.prisma.product.count({ where });
  }

  async getFacets(options: {
    search?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    minAbv?: number;
    maxAbv?: number;
    minPureAlcoholPerDollar?: number;
    maxPureAlcoholPerDollar?: number;
  }): Promise<Facet[]> {
    const { categories, ...otherOptions } = options;
    const where = this.buildWhereClause(otherOptions);

    const facets = await this.prisma.product.groupBy({
      by: ["category"],
      where,
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
    });

    return facets.map((f) => ({
      category: f.category,
      count: f._count.category,
    }));
  }

  async getRanges(): Promise<{
    minPrice: number;
    maxPrice: number;
    minAbv: number;
    maxAbv: number;
    minPureAlcoholPerDollar: number;
    maxPureAlcoholPerDollar: number;
  }> {
    const result = await this.prisma.product.aggregate({
      _min: {
        currentPrice: true,
        abv: true,
        pureAlcoholPerDollar: true,
      },
      _max: {
        currentPrice: true,
        abv: true,
        pureAlcoholPerDollar: true,
      },
    });

    return {
      minPrice: result._min.currentPrice ?? 0,
      maxPrice: result._max.currentPrice ?? 200,
      minAbv: result._min.abv ?? 0,
      maxAbv: result._max.abv ?? 100,
      minPureAlcoholPerDollar: result._min.pureAlcoholPerDollar ?? 0,
      maxPureAlcoholPerDollar: result._max.pureAlcoholPerDollar ?? 20,
    };
  }
}
