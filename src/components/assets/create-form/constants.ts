// Condition grades are now managed dynamically in the database
// Use the useConditionGrades hook to fetch current grades
// See: booking/src/hooks/useConditionGrades.ts
// Database table: condition_grades

// Legacy conditionGrades export removed - grades are now fully dynamic

// IT Asset Categories are now managed dynamically in the database
// Use the useITAssetCategories hook to fetch current categories
// See: booking/src/hooks/useITAssetCategories.ts
// Database table: it_asset_categories

// NOTE: This export is deprecated. Use useITAssetCategories() hook instead.
// Kept for backward compatibility during migration.
export const itCategories = [
  "Laptop",
  "Desktop",
  "Smartphone",
  "Tablet",
  "Monitor",
  "Printer",
  "Other",
];
