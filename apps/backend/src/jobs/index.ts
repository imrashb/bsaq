import cron from "node-cron";
import { runScraperJob } from "./scrape.js";

export const initCronJobs = () => {
  console.log("Initializing cron jobs...");

  // Schedule: At minute 0 of every hour
  cron.schedule("0 * * * *", () => {
    runScraperJob();
  });

  console.log("Cron jobs scheduled: Scraper (Hourly)");
};

export const runStartupJobs = async () => {
  console.log("Running startup jobs...");
  // Run scraper immediately
  await runScraperJob();
};
