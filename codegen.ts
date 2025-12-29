import "dotenv/config";
import type { CodegenConfig } from "@graphql-codegen/cli";

console.error("API_KEY:", process.env.API_KEY);
const config: CodegenConfig = {
  overwrite: true,
  // Schema URL with headers
  schema: [
    {
      [process.env.GRAPHQL_ENDPOINT ||
      "https://catalog-service.adobe.io/graphql"]: {
        headers: {
          "X-Api-Key": process.env.API_KEY || "",
          "Magento-Environment-Id": process.env.MAGENTO_ENVIRONMENT_ID || "",
          "Magento-Website-Code": process.env.MAGENTO_WEBSITE_CODE || "",
          "Magento-Store-Code": process.env.MAGENTO_STORE_CODE || "",
          "Magento-Store-View-Code": process.env.MAGENTO_STORE_VIEW_CODE || "",
        },
      },
    },
  ],
  documents: "src/**/*.ts",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
