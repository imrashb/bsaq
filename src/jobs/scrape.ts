import { SaqService } from "../services/SaqService.js";
import { ProductRepository } from "../repositories/ProductRepository.js";

export const runScraperJob = async () => {
  console.log(`[${new Date().toISOString()}] Starting scraping job...`);
  const service = new SaqService();
  const repo = new ProductRepository();

  try {
    const products = await service.fetchAllProducts();
    console.log(`Fetched ${products.length} products. Starting DB upsert...`);

    // Upsert sequentially or in parallel? SQLite/Postgres might handle parallel, but let's be safe with sequential or batched.
    // Given the previous implementation loop, let's keep it simple.
    let count = 0;
    for (const product of products) {
      await repo.upsertProduct(product);
      count++;
      if (count % 1000 === 0)
        console.log(`Upserted ${count}/${products.length}...`);
    }

    console.log(
      `[${new Date().toISOString()}] Scraping job completed. Upserted ${count} products.`,
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Scraping job failed:`, error);
  }
};
