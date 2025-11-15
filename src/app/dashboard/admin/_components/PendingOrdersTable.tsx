import { getAllOrdersFromDB } from "@/app/actions/order";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TOrder } from "@/types/order.type";
import { getOrderStatusColor } from "@/utils/getOrderStatusColor";

import Link from "next/link";
import DeleteOrderModal from "../manage-orders/_components/DeleteOrderModal";
import OrderDetailsModal from "../manage-orders/_components/OrderDetailsModal";
import OrderStatusUpdateModal from "../manage-orders/_components/OrderStatusUpdateModal";

const PendingOrdersTable = async () => {
  const ordersResponse = await getAllOrdersFromDB({
    status: "pending",
    limit: 6,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg 2xl:text-2xl">
              Pending Orders
            </CardTitle>
            <CardDescription>
              Recent orders that need your attention
            </CardDescription>
          </div>
          <Link href="/dashboard/admin/manage-orders?status=pending">
            <Button
              variant="outline"
              size="sm"
              className="border border-primary dark:border-primary text-primary"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>

      {!ordersResponse?.success ? (
        <NoDataFound
          title="Pending orders not found!"
          description="We couldn’t find any orders in pending right now. Please check back later for new orders."
        />
      ) : (
        <CardContent className="px-3 md:px-6">
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 ">
            {ordersResponse?.data?.data?.length === 0 ? (
              <NoDataFoundBySearchFilter
                title="Orders not found!"
                description="Try searching for something else or clear all filters to explore available orders."
              />
            ) : (
              <Table>
                <TableHeader className="">
                  <TableRow className="">
                    <TableHead className="">No</TableHead>
                    <TableHead className="">Username</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {ordersResponse?.data?.data
                    ?.slice(0, 4)
                    .map((order: TOrder) => (
                      <tr
                        key={order._id}
                        className="group border-b border-gray-200 dark:border-gray-700 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell className="font-medium">
                          {order.fullName}
                        </TableCell>
                        <TableCell>{order.phone}</TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center justify-center px-3 py-[3px] rounded-full text-xs 2xl:text-sm font-semibold capitalize select-none transition-all duration-200",
                              getOrderStatusColor(order.status)
                            )}
                          >
                            {order.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-end gap-1 md:gap-2">
                            <OrderDetailsModal order={order} />

                            <OrderStatusUpdateModal order={order} />

                            <DeleteOrderModal orderId={order?._id} />
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PendingOrdersTable;
