import { SortEnum } from "./gql/graphql";
import { graphql } from "./gql";

export const config = {
  // Replace with the actual GraphQL API endpoint
  endpoint:
    process.env.GRAPHQL_ENDPOINT || "https://catalog-service.adobe.io/graphql",
  apiKey: process.env.API_KEY || "",
  magentoEnvironmentId: process.env.MAGENTO_ENVIRONMENT_ID || "",
  magentoWebsiteCode: process.env.MAGENTO_WEBSITE_CODE || "",
  magentoStoreCode: process.env.MAGENTO_STORE_CODE || "",
  magentoStoreViewCode: process.env.MAGENTO_STORE_VIEW_CODE || "",

  // Add any other configurable parameters here
  queryParams: {
    phrase: "",
    pageSize: process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE, 10) : 10,
    currentPage: 1,
    filter: [
      {
        attribute: "categoryPath",
        eq: "produits",
      },
      {
        attribute: "catalog_type",
        in: ["1"],
      },
      {
        attribute: "availability_front",
        in: [
          "En ligne",
          "En succursale",
          "Disponible bientôt",
          "Bientôt en loterie",
          "En loterie",
        ],
      },
      {
        attribute: "visibility",
        in: ["Catalog", "Catalog, Search"],
      },
    ],
    sort: [
      {
        attribute: "price",
        direction: SortEnum.Asc,
      },
    ],
    context: {
      customerGroup: "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c",
      userViewHistory: [],
    },
  },
};

export const PRODUCTS_QUERY = graphql(`
  query productSearch(
    $phrase: String!
    $pageSize: Int
    $currentPage: Int = 1
    $filter: [SearchClauseInput!]
    $sort: [ProductSearchSortInput!]
    $context: QueryContextInput
  ) {
    productSearch(
      phrase: $phrase
      page_size: $pageSize
      current_page: $currentPage
      filter: $filter
      sort: $sort
      context: $context
    ) {
      total_count
      items {
        product {
          __typename
          sku
          description {
            html
          }
          short_description {
            html
          }
          name
          canonical_url
          small_image {
            url
          }
          image {
            url
          }
          thumbnail {
            url
          }
        }
        productView {
          __typename
          sku
          name
          inStock
          url
          urlKey
          images {
            label
            url
            roles
          }
          attributes {
            label
            name
            value
          }
          ... on ComplexProductView {
            priceRange {
              maximum {
                final {
                  amount {
                    value
                    currency
                  }
                }
                regular {
                  amount {
                    value
                    currency
                  }
                }
              }
              minimum {
                final {
                  amount {
                    value
                    currency
                  }
                }
                regular {
                  amount {
                    value
                    currency
                  }
                }
              }
            }
            options {
              id
              title
              values {
                title
                ... on ProductViewOptionValueSwatch {
                  id
                  inStock
                  type
                  value
                }
              }
            }
          }
          ... on SimpleProductView {
            attributes {
              label
              name
              value
            }
            price {
              final {
                amount {
                  value
                  currency
                }
              }
              regular {
                amount {
                  value
                  currency
                }
              }
            }
          }
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`);
