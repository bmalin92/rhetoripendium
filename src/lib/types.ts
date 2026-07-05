export interface DeviceSummary {
  slug: string;
  name: string;
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  order: number;
  devices: DeviceSummary[];
}

export interface CriterionView {
  id: string;
  key: string;
  label: string;
  description: string;
}

export interface PromptView {
  id: string;
  order: number;
  prompt: string;
  instructions: string | null;
  minWords: number | null;
  maxWords: number | null;
  criteria: CriterionView[];
}

export interface SectionView {
  id: string;
  order: number;
  kind: "EXPLANATION" | "EXAMPLE" | "CLASSICAL_EXAMPLE" | "SUMMARY";
  heading: string | null;
  content: string;
}

export interface LessonDetail extends LessonSummary {
  sections: SectionView[];
  prompts: PromptView[];
}
