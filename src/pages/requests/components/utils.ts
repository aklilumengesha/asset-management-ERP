
// NOTE: This function is deprecated. Use useRequestStatuses().getStatusColor() instead.
// Kept for backward compatibility during migration.
export function getStatusColor(status: string) {
  // Fallback color mapping for backward compatibility
  const colorMap: Record<string, string> = {
    "Approved": "bg-green-100 text-green-700 border border-green-200",
    "APPROVED": "bg-green-100 text-green-700 border border-green-200",
    "Rejected": "bg-red-100 text-red-700 border border-red-200",
    "REJECTED": "bg-red-100 text-red-700 border border-red-200",
    "Pending": "bg-yellow-100 text-yellow-700 border border-yellow-200",
    "PENDING": "bg-yellow-100 text-yellow-700 border border-yellow-200",
    "In Approval": "bg-amber-100 text-amber-700 border border-amber-200",
    "IN_APPROVAL": "bg-amber-100 text-amber-700 border border-amber-200",
    "Not Started": "bg-gray-100 text-gray-700 border border-gray-200",
    "NOT_STARTED": "bg-gray-100 text-gray-700 border border-gray-200",
    "Draft": "bg-slate-100 text-slate-700 border border-slate-200",
    "DRAFT": "bg-slate-100 text-slate-700 border border-slate-200",
    "Delivered": "bg-blue-100 text-blue-700 border border-blue-200",
    "DELIVERED": "bg-blue-100 text-blue-700 border border-blue-200",
    "Processing": "bg-purple-100 text-purple-700 border border-purple-200",
    "PROCESSING": "bg-purple-100 text-purple-700 border border-purple-200",
    "Cancelled": "bg-rose-100 text-rose-700 border border-rose-200",
    "CANCELLED": "bg-rose-100 text-rose-700 border border-rose-200",
    "Completed": "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "COMPLETED": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  
  return colorMap[status] || "bg-indigo-100 text-indigo-700 border border-indigo-200";
}

// Add utility function for tag colors
export function getTagColor(tag: string) {
  const colors = {
    "High": "bg-red-100 text-red-700 border border-red-200",
    "Medium": "bg-yellow-100 text-yellow-700 border border-yellow-200",
    "Low": "bg-green-100 text-green-700 border border-green-200",
    "IT": "bg-blue-100 text-blue-700 border border-blue-200",
    "Finance": "bg-purple-100 text-purple-700 border border-purple-200",
    "HR": "bg-pink-100 text-pink-700 border border-pink-200",
    "Operations": "bg-indigo-100 text-indigo-700 border border-indigo-200",
    "Sales": "bg-teal-100 text-teal-700 border border-teal-200",
    "Marketing": "bg-orange-100 text-orange-700 border border-orange-200",
  };
  
  return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-700 border border-gray-200";
}

// Add utility function for priority colors
// Note: For components, prefer using usePriorityLevels hook's getPriorityColors()
export function getPriorityColor(priority: string) {
  const priorityUpper = priority.toUpperCase();
  
  // Map priority codes/names to color classes
  const colorMap: Record<string, string> = {
    'CRITICAL': "bg-red-100 text-red-700 border border-red-200",
    'HIGH': "bg-red-100 text-red-700 border border-red-200",
    'MEDIUM': "bg-amber-100 text-amber-700 border border-amber-200",
    'LOW': "bg-green-100 text-green-700 border border-green-200",
    'PLANNING': "bg-blue-100 text-blue-700 border border-blue-200",
  };
  
  return colorMap[priorityUpper] || "bg-gray-100 text-gray-700 border border-gray-200";
}
