// Depreciation categories are now managed dynamically in the database
// Use the useDepreciationCategories hook to fetch current categories
// See: booking/src/hooks/useDepreciationCategories.ts
// Database tables: ifrs_classifications, ifrs_categories, tax_categories

// Legacy IFRS_CLASSIFICATIONS, IFRS_CATEGORIES, and TAX_CATEGORIES exports removed
// All depreciation categories are now fully dynamic

import type { Option } from "./types";

// Depreciation methods remain static as they are standard accounting methods
export const DEPRECIATION_METHODS: Option[] = [
  { value: "straight-line", label: "Straight Line" },
  { value: "declining-balance", label: "Declining Balance" },
  { value: "sum-of-years", label: "Sum of Years" },
  { value: "units-of-production", label: "Units of Production" }
];
