import { getAllProductsFromDB } from "@/app/actions/product";
import ProductsSearch from "@/app/dashboard/admin/manage-products/_components/ProductsSearch";
import ProductsSort from "@/app/dashboard/admin/manage-products/_components/ProductsSort";
import Container from "@/components/shared/Ui/Container";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import MYPagination from "@/components/shared/Ui/Pagination/MYPagination";
import { TProduct } from "@/types";
import { Metadata } from "next";
import Banner from "../../../components/common/Banner";
import DesktopSidebar from "./_components/DesktopSidebar";
import MobileFilterToggle from "./_components/MobileFilterToggle";
import { ProductCard } from "./_components/ProductCard";

export const metadata: Metadata = {
  title: "Shop | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

type TShopPageParams = {
  searchTerm?: string;
  category?: string;
  page?: string;
  limit?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
};

const SHOP_PAGE_DATA_LIMIT = "8";

const ShopPage = async (props: { searchParams: Promise<TShopPageParams> }) => {
  const searchParams = await props?.searchParams;
  const {
    searchTerm,
    category,
    page = "1",
    limit = SHOP_PAGE_DATA_LIMIT,
    sort,
    minPrice,
    maxPrice,
  } = searchParams || {};

  const params: Record<string, string> = {};

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }
  if (category) {
    params.category = category;
  }
  if (page) {
    params.page = page;
  }
  if (limit) {
    params.limit = limit;
  }
  if (sort) {
    params.sort = sort;
  }
  if (minPrice) {
    params.minPrice = minPrice;
  }
  if (maxPrice) {
    params.maxPrice = maxPrice;
  }

  const productsResponse = await getAllProductsFromDB(params);

  const totalData = productsResponse?.data?.totalCount || 0;

  return (
    <div className="min-h-screen">
      <Container className="py-8">
        <Banner
          bgImage="/images/banners/shop-page-banner.jpg"
          title="Shop"
          description="Discover quality, comfort, and innovation — explore our curated collection of modern essentials."
          breadcrumbs={[{ label: "Shop", href: "/shop" }]}
        />

        <div className="flex flex-col lg:flex-row gap-6 my-8 mb-12">
          {/* Desktop Sidebar */}
          <DesktopSidebar />

          {/* Products Grid */}
          <main className="flex-1 ">
            {/* Search and Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <ProductsSearch />

              <div className="flex flex-row-reverse justify-between items-center gap-4">
                <ProductsSort />

                {/* Mobile Filter Toggle */}
                <MobileFilterToggle />
              </div>
            </div>

            {!productsResponse?.success ? (
              <NoDataFound
                title="Products not found!"
                description="We couldn’t find any products right now. Please check back later for new arrivals."
              />
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {productsResponse?.data?.data?.length} of{" "}
                  {productsResponse?.data?.totalCount || 0} products
                </div>

                {productsResponse?.data?.data?.length === 0 ? (
                  <NoDataFoundBySearchFilter
                    title="Products not found!"
                    description="Try searching for something else or clear all filters to explore available collections."
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
                      {productsResponse?.data?.data.map((product: TProduct) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>

                    {productsResponse?.data?.data?.length !== 0 &&
                      SHOP_PAGE_DATA_LIMIT < totalData && (
                        <div className="mt-6">
                          <MYPagination
                            totalData={totalData}
                            dataLimit={Number(SHOP_PAGE_DATA_LIMIT)}
                          />
                        </div>
                      )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;
