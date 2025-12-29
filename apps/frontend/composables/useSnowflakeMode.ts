import { useStorage } from "@vueuse/core";

export const useSnowflakeMode = () => {
  return useStorage("bsaq-snowflake-mode", false);
};
