
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { AssetField } from "./form/AssetField";
import { DescriptionField } from "./form/DescriptionField";
import { DateField } from "./form/DateField";
import { CostField } from "./form/CostField";
import { VendorField } from "./form/VendorField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import type { MaintenanceFormData } from "./form/types";
import { toast } from "sonner";
import { useMaintenanceTypes } from "@/hooks/useMaintenanceTypes";

interface CreateMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMaintenanceDialog({
  open,
  onOpenChange,
}: CreateMaintenanceDialogProps) {
  const { types: maintenanceTypes, loading: typesLoading } = useMaintenanceTypes();
  
  const form = useForm<MaintenanceFormData>({
    defaultValues: {
      assetId: "",
      description: "",
      maintenanceType: "INTERNAL",
      cost: 0,
      vendor: "",
      status: "Scheduled",
      notes: [],
      attachments: []
    },
  });

  const onSubmit = (data: MaintenanceFormData) => {
    // Convert the form data to match MaintenanceTask type
    const maintenanceTask = {
      ...data,
      id: `MAINT-${Math.random().toString(36).substr(2, 9)}`,
      assetName: "Asset Name", // This would come from asset lookup in real implementation
      scheduledDate: data.scheduledDate.toISOString(),
    };
    
    console.log("Maintenance task created:", maintenanceTask);
    toast.success("Maintenance task created successfully");
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Create Maintenance Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="maintenanceType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Maintenance Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={typesLoading}
                    >
                      {maintenanceTypes.map((type) => (
                        <FormItem key={type.id} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={type.code} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {type.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <AssetField form={form} />
            <DescriptionField form={form} />
            <DateField form={form} />
            <CostField form={form} />
            <VendorField form={form} />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
