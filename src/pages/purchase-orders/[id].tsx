import { useParams } from "react-router-dom";

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Purchase Order Details</h1>
      <p className="text-muted-foreground">PO ID: {id}</p>
    </div>
  );
}
