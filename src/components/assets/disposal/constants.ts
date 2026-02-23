// =====================================================
// DISPOSAL CONSTANTS
// =====================================================
// NOTE: Disposal Reasons have been moved to database (disposal_reasons table)
// Use the useDisposalReasons hook to fetch disposal reasons dynamically
// See: booking/src/hooks/useDisposalReasons.ts

// Disposal methods are still hardcoded - will be made dynamic in Commit 27
export const disposalMethods = [
  "Scrapped",
  "Sold",
  "Donated",
  "Transferred",
  "Other"
] as const;
