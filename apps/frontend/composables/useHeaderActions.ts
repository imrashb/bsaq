import { GITHUB_REPO_URL } from "~/utils/constants";

export interface HeaderAction {
  id: string;
  icon: string;
  color: string;
  title?: string;
  tooltip?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export function useHeaderActions() {
  const snowflakeMode = useSnowflakeMode();
  const { t } = useI18n();

  const actions = computed<HeaderAction[]>(() => [
    {
      id: "snowflake",
      icon: "mdi-snowflake",
      color: snowflakeMode.value ? "info" : "grey",
      title: t("app.snowflakeMode"),
      tooltip: t("app.snowflakeTooltip"),
      onClick: () => {
        snowflakeMode.value = !snowflakeMode.value;
      },
    },
    {
      id: "github",
      icon: "mdi-github",
      color: "primary",
      title: "GitHub",
      href: GITHUB_REPO_URL,
      target: "_blank",
    },
  ]);

  return actions;
}
