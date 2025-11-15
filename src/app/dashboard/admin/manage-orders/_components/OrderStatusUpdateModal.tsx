"use client";

import { updateOrderInDB } from "@/app/actions/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TOrder } from "@/types/order.type";
import { getOrderStatusColor } from "@/utils/getOrderStatusColor";
import { Loader, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

type TOrderStatusUpdateModalProps = {
  order: TOrder;
};

const OrderStatusUpdateModal = ({ order }: TOrderStatusUpdateModalProps) => {
  const [status, setStatus] = useState(order.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (status === order.status) return; // no change

    try {
      setIsLoading(true);

      const orderId = order._id;

      const res = await updateOrderInDB(orderId, { status: status });

      if (res?.success) {
        toast.success("Order deleted successfully!");
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = (value: string) => {
    setStatus(
      value as "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    );
  };

  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 2xl:h-9 2xl:w-9 hover:bg-muted"
        >
          <Pencil className="h-4 w-4 2xl:h-5 2xl:w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update Order Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Current Status */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Current Status
            </Label>
            <div className="mt-1">
              <Badge
                className={`text-xs font-medium capitalize ${getOrderStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* New Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Select New Status
            </Label>
            <Select value={status} onValueChange={handleChangeStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Choose new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="w-auto">
                Cancel
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                disabled={isLoading || status === order.status}
                onClick={handleUpdate}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />
                    <span>Deleting...</span>
                  </span>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusUpdateModal;
