
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GRN } from "@/types/grn";
import { formatDate } from "@/lib/utils";
import { useGRNStatuses } from "@/hooks/useGRNStatuses";

interface GRNTableProps {
  grns: GRN[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function GRNTable({
  grns,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange
}: GRNTableProps) {
  const navigate = useNavigate();
  const { statuses, getStatusByCode } = useGRNStatuses();
  
  const getStatusBadge = (statusCode: GRN['status']) => {
    const status = getStatusByCode(statusCode);
    
    if (!status) {
      return <Badge className="bg-gray-500">Unknown</Badge>;
    }

    return (
      <Badge className={status.badgeClass || 'bg-gray-500'}>
        {status.name}
      </Badge>
    );
  };
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = grns.slice(startIndex, endIndex);

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>GRN ID</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Received Date</TableHead>
          <TableHead>Total Items</TableHead>
          <TableHead>Total Value</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No GRNs found
            </TableCell>
          </TableRow>
        ) : (
          currentItems.map((grn) => (
            <TableRow key={grn.id}>
              <TableCell>{grn.id.slice(0, 8)}</TableCell>
              <TableCell>{grn.supplier_name}</TableCell>
              <TableCell>{formatDate(grn.received_date)}</TableCell>
              <TableCell>{grn.total_items}</TableCell>
              <TableCell>${grn.total_value.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(grn.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/grn/${grn.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {grn.status === 'SUBMITTED' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600"
                        onClick={() => {/* Will implement check/approve */}}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => {/* Will implement reject */}}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
