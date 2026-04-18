import type { FormStep } from "@/types";

// ─── Shared steps ─────────────────────────────────────────────────────────────

const contactStep: FormStep = {
  stepKey: "contact",
  fields: [
    { key: "firstName", labelKey: "form.labels.firstName", type: "text",  placeholderKey: "form.placeholders.firstName", required: true },
    { key: "lastName",  labelKey: "form.labels.lastName",  type: "text",  placeholderKey: "form.placeholders.lastName",  required: true },
    { key: "phone",     labelKey: "form.labels.phone",     type: "tel",   placeholderKey: "form.placeholders.phone",     required: true },
    { key: "email",     labelKey: "form.labels.email",     type: "email", placeholderKey: "form.placeholders.email",     required: true },
  ],
};

const businessContactStep: FormStep = {
  stepKey: "contact",
  fields: [
    { key: "firstName",    labelKey: "form.labels.firstName",    type: "text",  placeholderKey: "form.placeholders.firstName",    required: true },
    { key: "lastName",     labelKey: "form.labels.lastName",     type: "text",  placeholderKey: "form.placeholders.lastName",     required: true },
    { key: "phone",        labelKey: "form.labels.phone",        type: "tel",   placeholderKey: "form.placeholders.phone",        required: true },
    { key: "email",        labelKey: "form.labels.email",        type: "email", placeholderKey: "form.placeholders.email",        required: true },
    { key: "businessName", labelKey: "form.labels.businessName", type: "text",  placeholderKey: "form.placeholders.businessName", required: true },
  ],
};

const businessDetailsStep: FormStep = {
  stepKey: "details",
  fields: [
    { key: "industry",  labelKey: "form.labels.industry",  type: "select", optionsKey: "form.options.industry",  required: true },
    { key: "employees", labelKey: "form.labels.employees", type: "select", optionsKey: "form.options.employees", required: true },
    { key: "revenue",   labelKey: "form.labels.revenue",   type: "select", optionsKey: "form.options.revenue",   required: true },
  ],
};

// ─── Personal Lines ───────────────────────────────────────────────────────────

export const autoFlow: FormStep[] = [
  contactStep,
  {
    stepKey: "details",
    fields: [
      { key: "vin",   labelKey: "form.labels.vin",   type: "vin",  placeholderKey: "form.placeholders.vin", required: false },
      { key: "year",  labelKey: "form.labels.year",  type: "text", required: true },
      { key: "make",  labelKey: "form.labels.make",  type: "text", required: true },
      { key: "model", labelKey: "form.labels.model", type: "text", required: true },
    ],
  },
  {
    stepKey: "coverage",
    fields: [
      { key: "coverageAmount",  labelKey: "form.labels.coverageAmount", type: "select", optionsKey: "form.options.coverageAmount", required: true },
      { key: "currentInsurer",  labelKey: "form.labels.currentInsurer", type: "text",   required: false },
    ],
  },
];

export const homeFlow: FormStep[] = [
  contactStep,
  {
    stepKey: "details",
    fields: [
      { key: "address",   labelKey: "form.labels.address",   type: "address", placeholderKey: "form.placeholders.address", required: true },
      { key: "yearBuilt", labelKey: "form.labels.yearBuilt", type: "number",  required: true },
      { key: "squareFeet",labelKey: "form.labels.squareFeet",type: "number",  required: true },
      { key: "roofType",  labelKey: "form.labels.roofType",  type: "select",  optionsKey: "form.options.roofType", required: true },
    ],
  },
  {
    stepKey: "coverage",
    fields: [
      { key: "coverageAmount", labelKey: "form.labels.coverageAmount", type: "select", optionsKey: "form.options.coverageAmount", required: true },
      { key: "currentInsurer", labelKey: "form.labels.currentInsurer", type: "text",   required: false },
    ],
  },
];

export const rentersFlow: FormStep[] = [
  contactStep,
  {
    stepKey: "details",
    fields: [
      { key: "address", labelKey: "form.labels.address", type: "address", placeholderKey: "form.placeholders.address", required: true },
      { key: "zipCode", labelKey: "form.labels.zipCode", type: "text",    placeholderKey: "form.placeholders.zipCode",  required: true },
    ],
  },
  {
    stepKey: "coverage",
    fields: [
      { key: "coverageAmount", labelKey: "form.labels.coverageAmount", type: "select", optionsKey: "form.options.coverageAmount", required: true },
    ],
  },
];

// Condo is very similar to home
export const condoFlow: FormStep[] = homeFlow;

// Flood is address + coverage
export const floodFlow: FormStep[] = [
  contactStep,
  {
    stepKey: "details",
    fields: [
      { key: "address",   labelKey: "form.labels.address",   type: "address", placeholderKey: "form.placeholders.address", required: true },
      { key: "yearBuilt", labelKey: "form.labels.yearBuilt", type: "number",  required: true },
    ],
  },
  {
    stepKey: "coverage",
    fields: [
      { key: "coverageAmount", labelKey: "form.labels.coverageAmount", type: "select", optionsKey: "form.options.coverageAmount", required: true },
    ],
  },
];

// Bundle — ask what they want to combine
export const bundleFlow: FormStep[] = [
  contactStep,
  {
    stepKey: "details",
    fields: [
      { key: "address",   labelKey: "form.labels.address",   type: "address", placeholderKey: "form.placeholders.address", required: true },
      { key: "vin",       labelKey: "form.labels.vin",       type: "vin",     placeholderKey: "form.placeholders.vin",     required: false },
      { key: "year",      labelKey: "form.labels.year",      type: "text",    required: false },
      { key: "make",      labelKey: "form.labels.make",      type: "text",    required: false },
      { key: "model",     labelKey: "form.labels.model",     type: "text",    required: false },
    ],
  },
  {
    stepKey: "coverage",
    fields: [
      { key: "currentInsurer", labelKey: "form.labels.currentInsurer", type: "text", required: false },
    ],
  },
];

// ─── Commercial Lines ─────────────────────────────────────────────────────────

export const bopFlow: FormStep[] = [
  businessContactStep,
  businessDetailsStep,
  {
    stepKey: "coverage",
    fields: [
      { key: "address",        labelKey: "form.labels.address",        type: "address", placeholderKey: "form.placeholders.address", required: true },
      { key: "coverageAmount", labelKey: "form.labels.coverageAmount", type: "select",  optionsKey: "form.options.coverageAmount",   required: true },
    ],
  },
];

export const glFlow: FormStep[] = [businessContactStep, businessDetailsStep];

export const commercialAutoFlow: FormStep[] = [
  businessContactStep,
  {
    stepKey: "details",
    fields: [
      { key: "industry",  labelKey: "form.labels.industry",  type: "select", optionsKey: "form.options.industry",  required: true },
      { key: "employees", labelKey: "form.labels.employees", type: "select", optionsKey: "form.options.employees", required: true },
    ],
  },
  {
    stepKey: "coverage",
    fields: [
      { key: "vin",   labelKey: "form.labels.vin",   type: "vin",  placeholderKey: "form.placeholders.vin", required: false },
      { key: "year",  labelKey: "form.labels.year",  type: "text", required: true },
      { key: "make",  labelKey: "form.labels.make",  type: "text", required: true },
      { key: "model", labelKey: "form.labels.model", type: "text", required: true },
    ],
  },
];

export const workersCompFlow: FormStep[] = [businessContactStep, businessDetailsStep];
export const professionalFlow: FormStep[] = [businessContactStep, businessDetailsStep];
export const cyberFlow: FormStep[] = [businessContactStep, businessDetailsStep];

// ─── Registry ─────────────────────────────────────────────────────────────────

export const formFlows: Record<string, FormStep[]> = {
  auto:             autoFlow,
  home:             homeFlow,
  renters:          rentersFlow,
  condo:            condoFlow,
  flood:            floodFlow,
  bundle:           bundleFlow,
  bop:              bopFlow,
  gl:               glFlow,
  "commercial-auto":commercialAutoFlow,
  "workers-comp":   workersCompFlow,
  professional:     professionalFlow,
  cyber:            cyberFlow,
};
