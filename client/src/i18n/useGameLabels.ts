import { useLanguage } from "./LanguageContext";

export function useGameLabels() {
  const { t } = useLanguage();

  const statusLabel = (status: string) => {
    if (status === "scheduled") return t("common.scheduled");
    if (status === "finished") return t("common.finished");
    if (status === "live") return t("common.live");
    return status;
  };

  const stageLabel = (stage: string) => {
    if (stage === "Group Stage") return t("common.groupStage");
    return stage;
  };

  return { statusLabel, stageLabel };
}
