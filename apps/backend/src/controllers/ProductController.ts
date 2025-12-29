import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ProductService } from "../services/ProductService.js";
import { GetProductsResponse } from "@bsaq/types";

export async function productController(fastify: FastifyInstance) {
  const service = new ProductService();

  const QuerySchema = z
    .object({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(10),
      sort: z.string().optional(),
      search: z.string().optional(),
      categories: z.union([z.string(), z.array(z.string())]).optional(),
      minPrice: z.coerce.number().optional(),
      maxPrice: z.coerce.number().optional(),
      minAbv: z.coerce.number().optional(),
      maxAbv: z.coerce.number().optional(),
    })
    .refine(
      (data) => {
        if (data.minPrice !== undefined && data.maxPrice !== undefined) {
          return data.minPrice <= data.maxPrice;
        }
        return true;
      },
      { message: "minPrice must be less than or equal to maxPrice" },
    )
    .refine(
      (data) => {
        if (data.minAbv !== undefined && data.maxAbv !== undefined) {
          return data.minAbv <= data.maxAbv;
        }
        return true;
      },
      { message: "minAbv must be less than or equal to maxAbv" },
    );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/products",
    {
      schema: {
        querystring: QuerySchema,
      },
    },
    async (request, reply): Promise<GetProductsResponse | undefined> => {
      try {
        return await service.getProducts(request.query);
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" } as any);
      }
    },
  );
}
