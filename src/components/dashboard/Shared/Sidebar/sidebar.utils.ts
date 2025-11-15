import {
  LayoutDashboard,
  MessageCircle,
  MessageSquarePlus,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";

export const userSidebarItems = [
  { text: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
  {
    text: "My Products",
    href: "/dashboard/user/cart-products",
    icon: ShoppingCart,
  },
  { text: "Contact", href: "/contact/user/contact", icon: MessageCircle },
];

export const adminSidebarItems = [
  { text: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  {
    text: "Manage Categories",
    href: "/dashboard/admin/manage-categories",
    icon: Settings,
  },
  {
    text: "Upload Product",
    href: "/dashboard/admin/add-product",
    icon: MessageSquarePlus,
  },
  {
    text: "Manage Products",
    href: "/dashboard/admin/manage-products",
    icon: ShoppingBag,
  },
  {
    text: "Manage Orders",
    href: "/dashboard/admin/manage-orders",
    icon: Package,
  },
  {
    text: "Manage Reviews",
    href: "/dashboard/admin/manage-reviews?isVerified=false",
    icon: Star,
  },
  { text: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
];
