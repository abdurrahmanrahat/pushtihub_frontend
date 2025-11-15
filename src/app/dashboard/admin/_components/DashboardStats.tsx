import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  MessageCircleWarning,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: "24",
    change: "+2 from last month",
    icon: Package,
    trend: "up",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Orders",
    value: "156",
    change: "+23% from last month",
    icon: ShoppingCart,
    trend: "up",
    iconColor: "text-emerald-500",
  },
  {
    title: "Revenue",
    value: "$45,231",
    change: "+18% from last month",
    icon: DollarSign,
    trend: "down",
    iconColor: "text-purple-500",
  },
  {
    title: "Pending Orders",
    value: "25",
    change: "Needs attention",
    icon: Clock,
    trend: "warning",
    iconColor: "text-orange-500",
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="">
            <CardContent className="">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm xl:text-base 2xl:text-lg font-medium text-muted-foreground">
                  {stat.title}
                </div>
                <div className={`p-2 rounded-lg bg-muted/50 ${stat.iconColor}`}>
                  <Icon className="h-4 w-4 2xl:h-5 2xl:w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-xs 2xl:text-sm">
                  {stat.trend === "up" && (
                    <>
                      <TrendingUp className="h-3 w-3 2xl:h-4 2xl:w-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {stat.change}
                      </span>
                    </>
                  )}
                  {stat.trend === "down" && (
                    <>
                      <TrendingDown className="h-3 w-3 2xl:h-4 2xl:w-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {stat.change}
                      </span>
                    </>
                  )}
                  {stat.trend === "warning" && (
                    <>
                      <MessageCircleWarning className="h-3 w-3 2xl:h-4 2xl:w-4 text-orange-500" />
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        {stat.change}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
