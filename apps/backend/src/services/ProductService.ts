import { ProductRepository } from "../repositories/ProductRepository.js";
import { GetProductsQuery, GetProductsResponse } from "@bsaq/types";

export class ProductService {
  private repo: ProductRepository;

  constructor() {
    this.repo = new ProductRepository();
  }

  async getProducts(query: GetProductsQuery): Promise<GetProductsResponse> {
    const {
      page = 1,
      pageSize = 10,
      sort,
      search,
      categories: rawCategories,
      minPrice,
      maxPrice,
      minAbv,
      maxAbv,
    } = query;

    let categories: string[] | undefined;
    if (Array.isArray(rawCategories)) {
      categories = rawCategories;
    } else if (typeof rawCategories === "string") {
      categories = rawCategories.split(",");
    }

    const filterOptions = {
      search,
      categories,
      minPrice,
      maxPrice,
      minAbv,
      maxAbv,
    };

    const products = await this.repo.findAll({
      page,
      pageSize,
      sort,
      ...filterOptions,
    });

    // Quick count for meta (optional, but good for pagination)
    const total = await this.repo.count(filterOptions);
    const maxPureAlcoholPerDollar =
      await this.repo.getMaxPureAlcoholPerDollar();
    const facets = await this.repo.getFacets(filterOptions);

    return {
      data: products,
      meta: {
        page,
        pageSize,
        total,
        maxPureAlcoholPerDollar,
        facets,
      },
    };
  }
}
