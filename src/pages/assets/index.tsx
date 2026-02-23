import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { AssetFilters } from "@/components/assets/filters/AssetFilters";
import { AssetTable } from "@/components/assets/table/AssetTable";
import { DisposalDialog } from "@/components/assets/DisposalDialog";
import { BulkDisposalDialog } from "@/components/assets/BulkDisposalDialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CreateAssetForm } from "@/components/assets/CreateAssetForm";
import { HorizontalAssetsTabs } from "@/components/assets/HorizontalAssetsTabs";
import { useAssetStatuses } from "@/hooks/useAssetStatuses";
import { useAssetCategories } from "@/hooks/useAssetCategories";
import { useAssets } from "@/hooks/useAssets";
import { useLocations } from "@/hooks/useLocations";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Location {
  id: string;
  name: string;
  code: string;
  type: string;
  country: string;
  city: string;
}

export default function Assets() {
  const navigate = useNavigate();
  const { categories: dbCategories } = useAssetCategories();
  const { statuses: dbStatuses } = useAssetStatuses();
  const { assets, loading: isLoadingAssets, fetchAssets } = useAssets();
  const { locations, loading: isLoadingLocations } = useLocations();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssetForDisposal, setSelectedAssetForDisposal] = useState<any | null>(null);
  const [isBulkDisposalOpen, setIsBulkDisposalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [assetListTab, setAssetListTab] = useState("all");

  const categories = ["All", ...dbCategories.map(cat => cat.name)];
  const statuses = ["All", ...dbStatuses.map(status => status.name)];
  const ITEMS_PER_PAGE = 10;

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.assetNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || asset.status === selectedStatus;
    const matchesLocation = selectedLocation === "All" || asset.location?.id?.toString() === selectedLocation;

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const totalItems = filteredAssets.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredAssets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const viewAsset = (id: string) => {
    navigate(`/assets/${id}`);
  };

  const refreshAssetList = () => {
    console.log("Refreshing asset list");
    fetchAssets(); // Fetch fresh data from Supabase
    setSelectedAssets([]);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    refreshAssetList(); // Refresh the list after creating
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const createFormCategories = categories.filter(cat => cat !== "All");
  const createFormLocations = locations;

  const handleDisposeAsset = (asset: any) => {
    setSelectedAssetForDisposal(asset);
  };

  const assetsForBulkDisposal = assets.map(asset => ({
    id: asset.id,
    name: asset.name,
    assetNumber: asset.assetNumber || asset.id,
    category: asset.category,
    location: asset.location?.name || "Unknown",
    status: asset.status,
    currentValue: asset.value || 0,
    ifrsValue: (asset.value || 0) * 0.95,
    taxValue: (asset.value || 0) * 0.9,
  }));

  if (isLoadingAssets || isLoadingLocations) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Assets</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your organization's assets across Ethiopia</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedAssets.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setIsBulkDisposalOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" /> 
              Dispose ({selectedAssets.length})
            </Button>
          )}
          <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create Asset
          </Button>
        </div>
      </div>

      <HorizontalAssetsTabs />

      <div className="space-y-4">
        <Tabs value={assetListTab} onValueChange={setAssetListTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="it">IT Equipment</TabsTrigger>
            <TabsTrigger value="furniture">Furniture</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <AssetFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              dateRange={dateRange}
              setDateRange={setDateRange}
              categories={categories}
              statuses={statuses}
              locations={locations}
            />

            <div className="bg-white rounded-lg border overflow-x-auto">
              <AssetTable
                assets={currentItems}
                onViewAsset={viewAsset}
                onDispose={handleDisposeAsset}
                onTransferComplete={refreshAssetList}
                selectedAssets={selectedAssets}
                onAssetSelect={toggleAssetSelection}
                showSelection={true}
              />
            </div>

            <div className="mt-4 flex justify-center sm:justify-end">
              <Pagination>
                <PaginationContent className="flex flex-wrap justify-center gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((pageNum, idx) => (
                    pageNum === -1 ? (
                      <PaginationItem key={`ellipsis-${idx}`} className="hidden sm:block">
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === currentPage}
                          onClick={() => handlePageChange(pageNum)}
                          className="hidden sm:block"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
          
          <TabsContent value="it" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
              <ClipboardList className="h-16 w-16 text-muted mb-4" />
              <h3 className="text-lg font-medium mb-2">IT Equipment</h3>
              <p className="text-muted-foreground mb-6 max-w-lg">
                Filter view showing only IT equipment assets (computers, servers, networking gear, etc.)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="furniture" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
              <ClipboardList className="h-16 w-16 text-muted mb-4" />
              <h3 className="text-lg font-medium mb-2">Furniture Assets</h3>
              <p className="text-muted-foreground mb-6 max-w-lg">
                Filter view showing only furniture and fixtures assets
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
              <ClipboardList className="h-16 w-16 text-muted mb-4" />
              <h3 className="text-lg font-medium mb-2">Vehicle Assets</h3>
              <p className="text-muted-foreground mb-6 max-w-lg">
                Filter view showing only vehicle assets including cars, trucks, and other transport equipment
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedAssetForDisposal && (
        <DisposalDialog
          assetId={selectedAssetForDisposal.id}
          assetName={selectedAssetForDisposal.name}
          currentValue={selectedAssetForDisposal.value}
          open={!!selectedAssetForDisposal}
          onOpenChange={(open) => !open && setSelectedAssetForDisposal(null)}
          onDisposalComplete={refreshAssetList}
        />
      )}

      <BulkDisposalDialog
        assets={assetsForBulkDisposal}
        selectedAssetIds={selectedAssets}
        open={isBulkDisposalOpen}
        onOpenChange={setIsBulkDisposalOpen}
        onDisposalComplete={refreshAssetList}
      />

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Asset</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <CreateAssetForm
              onSuccess={handleCreateSuccess}
              categories={createFormCategories}
              locations={createFormLocations}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
