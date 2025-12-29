import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import type { Product } from "@bsaq/types";

export class ProductRepository {
  private prisma: PrismaClient;

  constructor() {
    const adapter = new PrismaPg(
      {
        connectionString: process.env.DATABASE_URL,
      },
      {
        schema: "bsaq",
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

  async findAll(options: {
    page: number;
    pageSize: number;
    sort?: string;
    search?: string;
    categories?: string[];
  }): Promise<Product[]> {
    const { page, pageSize, sort, search, categories } = options;
    const skip = (page - 1) * pageSize;

    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      pureAlcoholPerDollar: "desc",
    };

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

    switch (sort) {
      case "price_asc":
        orderBy = { currentPrice: "asc" };
        break;
      case "price_desc":
        orderBy = { currentPrice: "desc" };
        break;
      case "alcohol_asc":
        orderBy = { pureAlcoholPerDollar: "asc" };
        break;
      case "alcohol_desc":
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

  async count(search?: string, categories?: string[]): Promise<number> {
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
    return this.prisma.product.count({ where });
  }

  async getFacets(
    search?: string,
  ): Promise<{ category: string; count: number }[]> {
    const where: Prisma.ProductWhereInput = {};

    // Facets should be filtered by the search query to show relevant categories,
    // but usually NOT by the selected categories (so you can see other options).
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

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

  async getMaxPureAlcoholPerDollar(): Promise<number> {
    const result = await this.prisma.product.aggregate({
      _max: {
        pureAlcoholPerDollar: true,
      },
    });
    return result._max.pureAlcoholPerDollar as number; // Fallback default
  }
}
