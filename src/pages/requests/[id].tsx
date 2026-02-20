import { useParams } from "react-router-dom";

export default function RequestDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Request Details</h1>
      <p className="text-muted-foreground">Request ID: {id}</p>
    </div>
  );
}
