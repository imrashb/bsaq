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
      categories: rawCategories,
      ...filterParams
    } = query;

    // Process categories (convert string to array if needed)
    let categories: string[] | undefined;
    if (Array.isArray(rawCategories)) {
      categories = rawCategories;
    } else if (typeof rawCategories === "string") {
      categories = rawCategories.split(",");
    }

    // Combine processed categories with all other filter params
    const filterOptions = {
      ...filterParams,
      categories,
    };

    const products = await this.repo.findAll({
      page,
      pageSize,
      sort,
      ...filterOptions,
    });

    const total = await this.repo.count(filterOptions);
    const facets = await this.repo.getFacets(filterOptions);
    const { maxPureAlcoholPerDollar } = await this.repo.getRanges();

    return {
      data: products,
      meta: {
        page,
        pageSize,
        total,
        facets,
        maxPureAlcoholPerDollar,
      },
    };
  }
}
