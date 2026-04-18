export type Mode = "personal" | "commercial";
export type Language = "en" | "pt" | "es";

export interface ProductDefinition {
  id: string;
  title: string;
  description: string;
}

export interface FormField {
  key: string;
  labelKey: string;
  type: "text" | "email" | "tel" | "date" | "select" | "vin" | "address" | "number";
  placeholderKey?: string;
  optionsKey?: string;
  required?: boolean;
}

export interface FormStep {
  stepKey: string;
  fields: FormField[];
}

export interface FormData {
  [key: string]: string;
}
