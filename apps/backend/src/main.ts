import "dotenv/config";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { initCronJobs, runStartupJobs } from "./jobs/index.js";
import { productController } from "./controllers/ProductController.js";

const fastify = Fastify({
  logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(cors, {
  origin: true,
});

fastify.register(productController, { prefix: "/api" });

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
