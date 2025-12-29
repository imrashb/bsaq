import "dotenv/config";

const BASE_URL = "http://localhost:3000";

async function testApi() {
  console.log("Testing API Paging...");

  try {
    // 1. Fetch Page 1
    console.log("Fetching Page 1 (pageSize=2)...");
    const res1 = await fetch(`${BASE_URL}/products?page=1&pageSize=2`);
    const json1 = await res1.json();

    if (!res1.ok) throw new Error(`Failed to fetch page 1: ${res1.statusText}`);
    console.log(
      "Page 1 Data Sample:",
      JSON.stringify(
        json1.data.map((p: any) => p.sku),
        null,
        2,
      ),
    );
    console.log("Page 1 Meta:", json1.meta);

    // 2. Fetch Page 2
    console.log("\nFetching Page 2 (pageSize=2)...");
    const res2 = await fetch(`${BASE_URL}/products?page=2&pageSize=2`);
    const json2 = await res2.json();

    if (!res2.ok) throw new Error(`Failed to fetch page 2: ${res2.statusText}`);
    console.log(
      "Page 2 Data Sample:",
      JSON.stringify(
        json2.data.map((p: any) => p.sku),
        null,
        2,
      ),
    );
    console.log("Page 2 Meta:", json2.meta);

    // Verification
    if (json1.data.length !== 2)
      console.error("❌ Error: Page 1 should have 2 items");
    if (json2.data.length !== 2)
      console.error("❌ Error: Page 2 should have 2 items");

    const sku1 = json1.data[0].sku;
    const sku2 = json2.data[0].sku;
    if (sku1 === sku2) {
      console.error("❌ Error: Page 1 and Page 2 have same first item!");
    } else {
      console.log(
        "✅ Success: Pagination seems to work (different items on pages).",
      );
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testApi();
