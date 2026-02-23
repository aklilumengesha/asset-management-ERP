
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { AssetLocation } from "@/types/asset";
import { useEffect, useState } from "react";
import { useAssets } from "@/hooks/useAssets";

interface CreateAssetFormProps {
  onSuccess: () => void;
  categories: string[];
  locations: AssetLocation[];
  defaultValues?: FormData;
}

interface FormData {
  name: string;
  category: string;
  locationId: string;
  purchasePrice: string;
  purchaseDate: string;
}

export function CreateAssetForm({ onSuccess, categories = [], locations = [], defaultValues }: CreateAssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAsset } = useAssets();
  
  const form = useForm<FormData>({
    defaultValues: defaultValues || {
      name: "",
      category: "",
      locationId: "",
      purchasePrice: "",
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  // Update form values when defaultValues changes
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Create asset using Supabase
      const assetData = {
        name: data.name,
        category: data.category,
        location_id: data.locationId,
        purchase_price: parseFloat(data.purchasePrice),
        purchase_date: data.purchaseDate,
        status: "Available", // Default status
      };
      
      const { error } = await createAsset(assetData);
      
      if (!error) {
        form.reset();
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating asset:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Asset name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter asset name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationId"
          rules={{ required: "Location is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={locations.length === 0 ? "No locations available" : "Select a location"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No locations found. Please create a location first.
                    </div>
                  ) : (
                    locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} ({location.code}) - {location.city}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchasePrice"
          rules={{ 
            required: "Purchase price is required",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Please enter a valid price"
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Enter purchase price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseDate"
          rules={{ required: "Purchase date is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Asset"}
        </Button>
      </form>
    </Form>
  );
}
