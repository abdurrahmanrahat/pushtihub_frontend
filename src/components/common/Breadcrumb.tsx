import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type TBreadcrumbProps = {
  items: BreadcrumbItem[];
  isStart?: boolean;
  isBanner?: boolean;
};

export const Breadcrumb = ({
  items,
  isStart = false,
  isBanner = false,
}: TBreadcrumbProps) => {
  return (
    <nav
      className={`flex items-center ${
        isStart ? "justify-start" : "justify-center"
      } gap-2 text-sm ${
        isBanner ? "text-gray-300" : "text-gray-800 dark:text-gray-300"
      }`}
    >
      <Link
        href="/"
        className="hover:text-primary transition-colors flex items-center gap-1 2xl:text-base"
      >
        <Home className="h-4 2xl:h-5 w-4 2xl:w-5" />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 2xl:h-5 w-4 2xl:w-5" />

          <Link
            href={item.href}
            className={`hover:text-primary transition-colors 2xl:text-base ${
              index === items.length - 1 ? "text-primary font-medium" : ""
            }`}
          >
            {item.label.length > 20
              ? item.label.slice(0, 20) + "..."
              : item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};
