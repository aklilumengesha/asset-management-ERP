
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";
import type { CreatePOForm } from "@/pages/purchase-orders/types";
import { usePaymentTerms } from "@/hooks/usePaymentTerms";
import { useDeliveryTerms } from "@/hooks/useDeliveryTerms";
import { useUnitsOfMeasure } from "@/hooks/useUnitsOfMeasure";

interface CreatePOSidePanelProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePOSidePanel({ open, onClose, onSuccess }: CreatePOSidePanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { terms, loading: termsLoading, getDefaultTerm } = usePaymentTerms();
  const { terms: deliveryTerms, loading: deliveryLoading, getDefaultTerm: getDefaultDeliveryTerm } = useDeliveryTerms();
  const { units, loading: unitsLoading, getDefaultUnit } = useUnitsOfMeasure();

  // Define form with default values
  const form = useForm<CreatePOForm>({
    defaultValues: {
      po_date: new Date(),
      supplier_name: "",
      supplier_tin: "",
      supplier_address: "",
      payment_terms: getDefaultTerm()?.name || "Net 30",
      advance_payment: 0,
      delivery_terms: getDefaultDeliveryTerm()?.name || "Standard Shipping",
      delivery_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      delivery_address: "Main Office",
      notes: "",
      items: [
        {
          name: "",
          description: "",
          unit_of_measure: getDefaultUnit()?.name || "Units",
          quantity: 1,
          unit_price: 0,
          remarks: "",
        },
      ],
    },
  });

  const onSubmit = async (data: CreatePOForm) => {
    setIsSubmitting(true);
    
    try {
      // Calculate total price based on items
      const totalAmount = data.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      
      // Format the PO number
      const poNumber = `PO-${format(new Date(), "yyyy")}-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
      
      // Create new purchase order record
      const { data: newPO, error } = await supabase
        .from("purchase_orders")
        .insert({
          po_number: poNumber,
          po_date: format(data.po_date, "yyyy-MM-dd"),
          supplier_name: data.supplier_name,
          supplier_tin: data.supplier_tin,
          supplier_address: data.supplier_address,
          payment_terms: data.payment_terms,
          advance_payment: data.advance_payment || 0,
          delivery_terms: data.delivery_terms,
          delivery_date: data.delivery_date?.toISOString(),
          delivery_address: data.delivery_address,
          status: "DRAFT",
          total_amount: totalAmount,
          notes: data.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Insert PO items
      if (newPO) {
        for (let i = 0; i < data.items.length; i++) {
          const item = data.items[i];
          const totalPrice = item.quantity * item.unit_price;
          
          await supabase.from("purchase_order_items").insert({
            po_id: newPO.id,
            item_number: i + 1,
            name: item.name,
            description: item.description,
            unit_of_measure: item.unit_of_measure,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: totalPrice,
            remarks: item.remarks,
          });
        }
      }

      toast.success("Purchase order created successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Failed to create purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new item to the PO
  const addItem = () => {
    const items = form.getValues("items");
    form.setValue("items", [
      ...items,
      {
        name: "",
        description: "",
        unit_of_measure: getDefaultUnit()?.name || "Units",
        quantity: 1,
        unit_price: 0,
        remarks: "",
      },
    ]);
  };

  // Remove an item from the PO
  const removeItem = (index: number) => {
    const items = form.getValues("items");
    if (items.length > 1) {
      form.setValue(
        "items",
        items.filter((_, i) => i !== index)
      );
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    const items = form.getValues("items");
    return items.reduce(
      (total, item) => total + (item.quantity * item.unit_price),
      0
    );
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto" side="right">
        <SheetHeader className="flex flex-row items-center justify-between pr-4">
          <SheetTitle className="text-xl font-bold">Create Purchase Order</SheetTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="supplier_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter supplier name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier_tin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Identification Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter supplier TIN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier_address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Supplier Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter supplier address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase Order Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="payment_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={termsLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={termsLoading ? "Loading terms..." : "Select payment terms"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {terms.map((term) => (
                              <SelectItem key={term.id} value={term.name}>
                                {term.name}
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
                    name="advance_payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advance Payment ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="delivery_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Terms</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={deliveryLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={deliveryLoading ? "Loading terms..." : "Select delivery terms"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {deliveryTerms.map((term) => (
                              <SelectItem key={term.id} value={term.name}>
                                {term.name}
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
                    name="delivery_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Main Office" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any additional notes or instructions" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Items</CardTitle>
                  <Button type="button" onClick={addItem} variant="outline">
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  {form.getValues("items").map((_, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Item #{index + 1}</h3>
                        {form.getValues("items").length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <Label htmlFor={`items.${index}.name`}>
                            Item Name
                          </Label>
                          <Input
                            id={`items.${index}.name`}
                            placeholder="Enter item name"
                            {...form.register(`items.${index}.name`)}
                            className="mt-1"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor={`items.${index}.description`}>
                            Item Description
                          </Label>
                          <Input
                            id={`items.${index}.description`}
                            placeholder="Enter item description"
                            {...form.register(`items.${index}.description`)}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`items.${index}.unit_of_measure`}>
                            Unit of Measure
                          </Label>
                          <Select
                            value={form.watch(`items.${index}.unit_of_measure`)}
                            onValueChange={(value) => form.setValue(`items.${index}.unit_of_measure`, value)}
                            disabled={unitsLoading}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={unitsLoading ? "Loading..." : "Select unit"} />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit.id} value={unit.name}>
                                  {unit.name} {unit.abbreviation && `(${unit.abbreviation})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`items.${index}.quantity`}>Quantity</Label>
                          <Input
                            id={`items.${index}.quantity`}
                            type="number"
                            min="1"
                            {...form.register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`items.${index}.unit_price`}>
                            Unit Price ($)
                          </Label>
                          <Input
                            id={`items.${index}.unit_price`}
                            type="number"
                            min="0"
                            step="0.01"
                            {...form.register(`items.${index}.unit_price`, {
                              valueAsNumber: true,
                            })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Total</Label>
                          <Input
                            type="text"
                            value={`${(
                              form.getValues(`items.${index}.quantity`) *
                              form.getValues(`items.${index}.unit_price`)
                            ).toFixed(2)}`}
                            disabled
                            className="mt-1 bg-muted"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor={`items.${index}.remarks`}>Remarks</Label>
                          <Input
                            id={`items.${index}.remarks`}
                            placeholder="Optional remarks"
                            {...form.register(`items.${index}.remarks`)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-xs">
                      <Label>Total Amount</Label>
                      <Input
                        type="text"
                        value={`${calculateTotal().toFixed(2)}`}
                        disabled
                        className="mt-1 bg-muted text-lg font-medium"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 pb-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Purchase Order"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
