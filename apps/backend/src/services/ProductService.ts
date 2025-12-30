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

    // Quick count for meta (optional, but good for pagination)
    const total = await this.repo.count(filterOptions);
    const ranges = await this.repo.getRanges();
    const facets = await this.repo.getFacets(filterOptions);

    return {
      data: products,
      meta: {
        page,
        pageSize,
        total,
        ...ranges,
        facets,
      },
    };
  }
}
