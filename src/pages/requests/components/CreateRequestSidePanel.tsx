import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface CreateRequestSidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRequestSidePanel({ open, onOpenChange }: CreateRequestSidePanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Request</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <p className="text-muted-foreground">Request creation form will go here</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
