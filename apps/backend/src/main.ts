import "dotenv/config";
import Fastify from "fastify";
import z from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { initCronJobs, runStartupJobs } from "./jobs/index.js";

const fastify = Fastify({
  logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const repo = new ProductRepository();

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

fastify.withTypeProvider<ZodTypeProvider>().get(
  "/products",
  {
    schema: {
      querystring: QuerySchema,
    },
  },
  async (request, reply) => {
    const { page, pageSize } = request.query;

    try {
      const products = await repo.findAll({
        page,
        pageSize,
      });

      // Quick count for meta (optional, but good for pagination)
      const total = await repo.count();

      return {
        data: products,
        meta: {
          page,
          pageSize,
          total,
        },
      };
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },
);

// Startup sequence
const start = async () => {
  try {
    if (!process.env.DISABLE_CRON) {
      initCronJobs();
    }

    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server is running at http://localhost:${port}`);

    if (!process.env.DISABLE_CRON) {
      runStartupJobs().catch((err) => console.error("Startup job failed", err));
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
