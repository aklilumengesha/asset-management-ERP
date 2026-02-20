import { useParams } from "react-router-dom";

export default function GRNDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">GRN Details</h1>
      <p className="text-muted-foreground">GRN ID: {id}</p>
    </div>
  );
}
