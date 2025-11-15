import { getAllOrdersFromDB } from "@/app/actions/order";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import MYPagination from "@/components/shared/Ui/Pagination/MYPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Metadata } from "next";
import DeleteOrderModal from "./_components/DeleteOrderModal";
import OrderDetailsModal from "./_components/OrderDetailsModal";
import OrdersSearch from "./_components/OrdersSearch";
import OrdersStatus from "./_components/OrdersStatus";
import OrderStatusUpdateModal from "./_components/OrderStatusUpdateModal";

export const metadata: Metadata = {
  title: "Manage Orders > Dashboard | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

type TManageOrdersPageParams = {
  searchTerm?: string;
  status?: string;
  page?: string;
  limit?: string;
};

const MANAGE_ORDERS_DATA_LIMIT = "8";

const ManageOrdersPage = async (props: {
  searchParams: Promise<TManageOrdersPageParams>;
}) => {
  const searchParams = await props?.searchParams;

  const {
    searchTerm,
    status,
    page = "1",
    limit = MANAGE_ORDERS_DATA_LIMIT,
  } = searchParams || {};

  const params: Record<string, string> = {};

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }
  if (status) {
    params.status = status;
  }
  if (page) {
    params.page = page;
  }
  if (limit) {
    params.limit = limit;
  }

  const ordersResponse = await getAllOrdersFromDB(params);

  const totalData = ordersResponse?.data?.totalCount || 0;

  return (
    <div className="min-h-screen w-full">
      <div>
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-card px-3 md:px-6">
            <CardTitle className="text-xl md:text-2xl 2xl:text-3xl font-semibold">
              All Orders List
            </CardTitle>
          </CardHeader>

          {!ordersResponse?.success ? (
            <NoDataFound
              title="Orders not found!"
              description="We couldn’t find any orders right now. Please check back later for new orders."
            />
          ) : (
            <CardContent className="px-3 md:px-6">
              {/* Filters Section */}
              <div className="mb-6 flex flex-col gap-2 md:gap-4 sm:flex-row sm:items-center">
                <OrdersSearch />

                <OrdersStatus />
              </div>

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
                      {ordersResponse?.data?.data?.map((order: TOrder) => (
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
                            <div className="flex items-center justify-center gap-1 md:gap-2">
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

              {ordersResponse?.data?.data?.length !== 0 &&
                MANAGE_ORDERS_DATA_LIMIT < totalData && (
                  <div className="mt-6">
                    <MYPagination
                      totalData={totalData}
                      dataLimit={Number(MANAGE_ORDERS_DATA_LIMIT)}
                    />
                  </div>
                )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageOrdersPage;
