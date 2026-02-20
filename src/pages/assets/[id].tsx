import { useParams } from "react-router-dom";

export default function AssetDetails() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Asset Details</h1>
      <p className="text-muted-foreground">Asset ID: {id}</p>
    </div>
  );
}
