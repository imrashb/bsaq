import { ApolloClient } from "@apollo/client";
import { config, PRODUCTS_QUERY } from "../config";
import { SortEnum } from "../gql/graphql";
import type { Product, ProductAttributes } from "@bsaq/types";
import {
  Mapper,
  ProductSearchItem,
  ProductSearchQuery,
  calculatePureAlcoholMl,
  calculatePureAlcoholPerDollar,
  extractCurrentPrice,
  extractImageUrl,
  extractOriginalPrice,
  extractSku,
  extractUrl,
} from "../utils.js";
import { HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";

type ProcessingContext = {
  productList: Product[];
  skus: Set<string>;
  totalPages: number;
  currentPage: number;
  isReverse: boolean;
  hasCollisionInReverse: boolean;
};

export class SaqService {
  private client: ApolloClient;

  private readonly MAPPERS: Mapper<ProductAttributes>[] = [
    {
      name: "format_contenant_ml",
      key: "volumeMl",
      transform: (value) => parseInt(value, 10),
    },
    {
      name: "pourcentage_alcool_par_volume",
      key: "abv",
      transform: (value) => parseFloat(value),
    },
    {
      name: "sanitized_name",
      key: "name",
    },
    {
      name: "identite_produit",
      key: "category",
    },
    {
      name: "pays_origine",
      key: "country",
    },
    {
      name: "in_stock_in_store",
      key: "isAvailableInStore",
      transform: (value) => value === "1",
    },
    {
      name: "reviews_average_rating",
      key: "reviewsAverageRating",
      transform: (value) => parseFloat(value),
    },
    {
      name: "reviews_count_rating",
      key: "reviewsCountRating",
      transform: (value) => parseInt(value, 10),
    },
  ];

  constructor() {
    this.client = new ApolloClient({
      link: new HttpLink({
        uri: config.endpoint,
        headers: {
          "X-Api-Key": config.apiKey,
          "Magento-Environment-Id": config.magentoEnvironmentId,
          "Magento-Website-Code": config.magentoWebsiteCode,
          "Magento-Store-Code": config.magentoStoreCode,
          "Magento-Store-View-Code": config.magentoStoreViewCode,
        },
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  }

  private async addProductsToProductList(
    batch: Product[],
    ctx: ProcessingContext,
  ) {
    const { productList, skus } = ctx;
    let batchHasCollision = false;
    for (const product of batch) {
      const hasCollision = skus.has(product.sku);
      if (hasCollision) batchHasCollision = true;
      else {
        skus.add(product.sku);
        productList.push(product);
      }
    }
    return batchHasCollision;
  }

  private flipSort(ctx: ProcessingContext) {
    ctx.isReverse = true;
    ctx.currentPage = 0;
  }

  private getFilteredProducts(ctx: ProcessingContext) {
    const filteredByCurrentAlcoholMlPerDollar = ctx.productList.filter(
      (product) => product.pureAlcoholPerDollar !== null,
    );
    filteredByCurrentAlcoholMlPerDollar.sort(
      (a, b) => (b.pureAlcoholPerDollar ?? 0) - (a.pureAlcoholPerDollar ?? 0),
    );
    return filteredByCurrentAlcoholMlPerDollar;
  }

  private async scrapeProducts(ctx: ProcessingContext) {
    console.log("Starting product scrape...");

    while (ctx.currentPage <= ctx.totalPages) {
      try {
        ctx.currentPage++;

        const direction = ctx.isReverse ? SortEnum.Desc : SortEnum.Asc;
        const sortParam = [{ attribute: "price", direction }];
        const pagedProducts = await this.fetchPage(sortParam, ctx);

        const batchHasCollision = await this.addProductsToProductList(
          pagedProducts,
          ctx,
        );

        if (ctx.isReverse) {
          if (ctx.hasCollisionInReverse) break;
          if (batchHasCollision) ctx.hasCollisionInReverse = true;
        }
      } catch (error) {
        if (ctx.isReverse) break;
        else this.flipSort(ctx);
      }
    }
  }

  public async fetchAllProducts(): Promise<Product[]> {
    const ctx: ProcessingContext = {
      productList: [],
      skus: new Set<string>(),
      totalPages: 1000,
      currentPage: 0,
      isReverse: false,
      hasCollisionInReverse: false,
    };

    await this.scrapeProducts(ctx);
    const filtered = this.getFilteredProducts(ctx);
    console.log("Scraping complete!");
    return filtered;
  }

  private async fetchPage(
    sort: typeof config.queryParams.sort,
    ctx: ProcessingContext,
  ): Promise<Product[]> {
    const { currentPage, totalPages } = ctx;
    console.log(`Fetching page ${currentPage} out of ${totalPages}...`);

    const { data } = await this.client.query<ProductSearchQuery>({
      query: PRODUCTS_QUERY,
      variables: { ...config.queryParams, currentPage, sort },
    });

    ctx.totalPages = data?.productSearch?.page_info?.total_pages || 0;

    console.log(`Fetched ${data?.productSearch?.items?.length} products.`);

    const proccesedProducts: Product[] = data?.productSearch.items
      ?.map((item) => this.processProductItem(item))
      .filter((item: Product | undefined) => !!item) as Product[];

    return proccesedProducts;
  }

  private processProductItem(
    item: ProductSearchItem | null | undefined,
  ): Product | undefined {
    if (!item) return undefined;
    const attributes = this.extractAttributes(item);

    const currentPrice = extractCurrentPrice(item);
    const originalPrice = extractOriginalPrice(item);

    const pureAlcoholMl = calculatePureAlcoholMl(attributes);
    const currentAlcoholMlPerDollar = calculatePureAlcoholPerDollar(
      pureAlcoholMl,
      currentPrice,
    );
    const originalAlcoholMlPerDollar = calculatePureAlcoholPerDollar(
      pureAlcoholMl,
      originalPrice,
    );

    return {
      ...attributes,
      sku: extractSku(item) || "",
      url: extractUrl(item) || "",
      imageUrl: extractImageUrl(item) || null,
      currentPrice: currentPrice || null,
      originalPrice: originalPrice || null,
      pureAlcoholMl: pureAlcoholMl || null,
      pureAlcoholPerDollar: currentAlcoholMlPerDollar || null,
      pureAlcoholPerOriginalDollar: originalAlcoholMlPerDollar || null,
    };
  }
  private extractAttributes(item: ProductSearchItem): ProductAttributes {
    return this.MAPPERS.reduce((acc, mapper) => {
      const attr = item.productView?.attributes?.find(
        (attr) => attr?.name === mapper.name,
      );
      if (attr) {
        return {
          ...acc,
          [mapper.key]: mapper.transform
            ? mapper.transform(attr.value)
            : attr.value,
        };
      }
      return acc;
    }, {} as ProductAttributes);
  }
}
