import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import { Product } from "../utils.js";

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
    sortBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<Product[]> {
    const { page, pageSize, sortBy } = options;
    const skip = (page - 1) * pageSize;

    return this.prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy: sortBy ? sortBy : { pureAlcoholPerDollar: "desc" },
    });
  }

  async count(): Promise<number> {
    return this.prisma.product.count();
  }
}
