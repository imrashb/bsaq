import "dotenv/config";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { Product } from "../utils.js";

const sampleProduct: Product = {
  sku: "TEST-SKU-001",
  name: "Test Product",
  volumeMl: 750,
  abv: 12.5,
  category: "Test Category",
  country: "Test Country",
  isAvailableInStore: true,
  url: "http://example.com/product",
  currentPrice: 20.0,
  originalPrice: 20.0,
  pureAlcoholMl: 93.75,
  pureAlcoholPerDollar: 4.68,
  pureAlcoholPerOriginalDollar: 4.68,
};

async function testRepository() {
  const repo = new ProductRepository();

  console.log("Upserting sample product...");
  await repo.upsertProduct(sampleProduct);
  console.log("Product upserted.");

  console.log("Fetching products...");
  const products = await repo.findAll({ page: 1, pageSize: 1 });
  console.log("Fetched products:", products);

  if (products.length > 0 && products[0].sku === sampleProduct.sku) {
    console.log("Verification SUCCESS: Product found in DB.");
  } else {
    console.error("Verification FAILED: Product not found.");
  }
}

testRepository()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
