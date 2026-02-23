
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, MapPin, Wrench, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TransferDialog } from "@/components/assets/TransferDialog";
import { DepreciationTab } from "@/components/assets/tabs/DepreciationTab";
import { MaintenanceTab } from "@/components/assets/tabs/MaintenanceTab";
import { AttachmentsTab } from "@/components/assets/tabs/AttachmentsTab";
import { LocationTab } from "@/components/assets/tabs/LocationTab";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MaintenanceTask } from "@/types/maintenance";

interface AssetDetail {
  id: string;
  name: string;
  assetNumber: string;
  category: string;
  location: string;
  status: string;
  value: number;
  acquisitionDate?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  currentBookValue?: number;
  assignedTo?: string;
  itCategory?: string;
  brandModel?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  color?: string;
  condition?: string;
  conditionNotes?: string;
  otherSpecs?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  maintenanceHistory: MaintenanceTask[];
  depreciation: {
    method: string;
    usefulLife: string;
    salvageValue: number;
    monthlyDepreciation: number;
  };
  attachments: Array<{
    id: number;
    name: string;
    type: string;
    date: string;
  }>;
}

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAssetDetail(id);
    }
  }, [id]);

  const fetchAssetDetail = async (assetId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          asset_categories(name),
          asset_statuses(name),
          condition_grades(grade_code, name)
        `)
        .eq('id', assetId)
        .single();

      if (error) throw error;

      if (data) {
        // Map the database data to the expected format
        const mappedAsset: AssetDetail = {
          id: data.id,
          name: data.name,
          assetNumber: data.asset_number || data.id,
          category: data.category || data.asset_categories?.name || 'Unknown',
          location: 'Unknown Location', // Will be populated when we join with locations
          status: data.status || data.asset_statuses?.name || 'Unknown',
          value: data.current_value || data.purchase_price || 0,
          acquisitionDate: data.purchase_date,
          purchasePrice: data.purchase_price,
          purchaseDate: data.purchase_date,
          currentBookValue: data.current_value || data.purchase_price,
          assignedTo: 'Unassigned', // Will be populated when we join with users
          serialNumber: data.serial_number,
          model: data.model,
          manufacturer: data.manufacturer,
          condition: data.condition_grades?.grade_code || 'N/A',
          maintenanceHistory: [], // TODO: Fetch from maintenance table
          depreciation: {
            method: 'Straight Line',
            usefulLife: '3 years',
            salvageValue: (data.purchase_price || 0) * 0.2,
            monthlyDepreciation: ((data.purchase_price || 0) * 0.8) / 36
          },
          attachments: [] // TODO: Fetch from attachments table
        };

        setAsset(mappedAsset);
      }
    } catch (error: any) {
      console.error('Error fetching asset:', error);
      toast.error('Failed to load asset details');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferComplete = () => {
    console.log("Asset transferred, refreshing data...");
    if (id) {
      fetchAssetDetail(id);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Asset Not Found</h2>
          <p className="text-muted-foreground mb-6">The asset you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/assets")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Button>
        </div>
      </div>
    );
  }

  const isITAsset = asset.category === "IT Equipment";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/assets")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Button>
        <TransferDialog
          assetId={asset.id}
          assetName={asset.name}
          currentLocation={asset.location}
          onTransferComplete={handleTransferComplete}
        />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Asset Details</h1>
        <p className="text-muted-foreground">
          Viewing detailed information for asset {id}
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-card w-full justify-start">
          <TabsTrigger value="details">
            <Info className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="depreciation">
            <FileText className="h-4 w-4 mr-2" />
            Depreciation
          </TabsTrigger>
          <TabsTrigger value="location">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="attachments">
            <FileText className="h-4 w-4 mr-2" />
            Attachments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
              <CardDescription>Asset ID: {asset.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{asset.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>{asset.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>{asset.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                  <p>{asset.assignedTo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
                  <p>${asset.purchasePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Value</p>
                  <p>${asset.currentBookValue.toFixed(2)}</p>
                </div>
              </div>

              {isITAsset && (
                <>
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">IT Asset Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">IT Category</p>
                        <p>{asset.itCategory}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Brand/Model</p>
                        <p>{asset.brandModel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Processor</p>
                        <p>{asset.processor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Memory</p>
                        <p>{asset.memory}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Storage</p>
                        <p>{asset.storage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Color</p>
                        <p>{asset.color}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Condition Grade</p>
                        <p>{asset.condition}</p>
                      </div>
                    </div>
                    {(asset.conditionNotes || asset.otherSpecs) && (
                      <div className="mt-4 grid grid-cols-1 gap-4">
                        {asset.conditionNotes && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Condition Notes</p>
                            <p className="mt-1">{asset.conditionNotes}</p>
                          </div>
                        )}
                        {asset.otherSpecs && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Other Specifications</p>
                            <p className="mt-1">{asset.otherSpecs}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation">
          <DepreciationTab depreciation={asset.depreciation} />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTab maintenanceHistory={asset.maintenanceHistory} />
        </TabsContent>

        <TabsContent value="attachments">
          <AttachmentsTab attachments={asset.attachments} />
        </TabsContent>

        <TabsContent value="location">
          <LocationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
