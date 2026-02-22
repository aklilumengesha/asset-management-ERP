
import { CustomSelect } from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { AssetCategory } from "./types";
import { useDepreciationCategories } from "@/hooks/useDepreciationCategories";

interface CategorySelectionProps {
  selectedCategory?: AssetCategory;
  onCategoryChange: (category: Partial<AssetCategory>) => void;
}

export function CategorySelection({ selectedCategory, onCategoryChange }: CategorySelectionProps) {
  const { ifrsClassifications, ifrsCategories, taxCategories, loading } = useDepreciationCategories();

  const ifrsClassOptions = ifrsClassifications.map(cls => ({
    value: cls.class_code,
    label: cls.name
  }));

  const ifrsCategoryOptions = ifrsCategories.map(cat => ({
    value: cat.code,
    label: cat.name
  }));

  const taxCategoryOptions = taxCategories.map(cat => ({
    value: cat.code,
    label: cat.name
  }));

  const handleIFRSClassChange = (value: string) => {
    const classification = ifrsClassifications.find(cls => cls.class_code === value);
    if (classification) {
      onCategoryChange({ 
        ifrsClassification: {
          class: classification.class_code,
          name: classification.name,
          description: classification.description || ''
        }
      });
    }
  };

  const handleIFRSCategoryChange = (value: string) => {
    const category = ifrsCategories.find(cat => cat.code === value);
    if (category) {
      onCategoryChange({ 
        ifrsCategory: {
          code: category.code,
          name: category.name,
          class: category.class_code,
          description: category.description || ''
        }
      });
    }
  };

  const handleTaxCategoryChange = (value: string) => {
    const category = taxCategories.find(cat => cat.code === value);
    if (category) {
      onCategoryChange({ 
        taxCategory: {
          code: category.code,
          name: category.name,
          description: category.description || '',
          depreciationRate: category.depreciation_rate,
          isCustom: category.is_custom
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>IFRS Classification</Label>
        <CustomSelect
          options={ifrsClassOptions}
          value={selectedCategory?.ifrsClassification?.class || ""}
          onChange={handleIFRSClassChange}
          placeholder="Select IFRS Classification"
        />
      </div>

      <div>
        <Label>IFRS Category</Label>
        <CustomSelect
          options={ifrsCategoryOptions}
          value={selectedCategory?.ifrsCategory?.code || ""}
          onChange={handleIFRSCategoryChange}
          placeholder="Select IFRS Category"
        />
      </div>

      <div>
        <Label>Tax Category</Label>
        <CustomSelect
          options={taxCategoryOptions}
          value={selectedCategory?.taxCategory?.code || ""}
          onChange={handleTaxCategoryChange}
          placeholder="Select Tax Category"
        />
      </div>
    </div>
  );
}
