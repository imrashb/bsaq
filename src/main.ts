import "dotenv/config";
import { writeFileSync } from "node:fs";
import { SaqService } from "./services/SaqService";

async function main() {
  const service = new SaqService();
  const products = await service.fetchAllProducts();

  writeFileSync("./products.json", JSON.stringify(products, null, 2));

  console.log(`Success.`);
}

main().catch((err) => {
  console.error("Failed to fetch products", err);
  process.exit(1);
});
