import { getAllProductsFromDB } from "@/app/actions/product";
import Container from "@/components/shared/Ui/Container";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import SectionTitle from "@/components/shared/Ui/Title/SectionTitle";
import { Button } from "@/components/ui/button";
import { TProduct } from "@/types";
import Link from "next/link";
import { ProductCard } from "../../shop/_components/ProductCard";

const RecentProducts = async () => {
  const productsResponse = await getAllProductsFromDB();

  return (
    <Container className="pt-12 md:pt-16">
      <div className="shadow-cardLightShadow dark:shadow-cardDarkShadow rounded-xl section-space-for-shadow">
        <SectionTitle title="Recent Products" />

        <div className="mt-6">
          {!productsResponse?.success ? (
            <NoDataFound
              title="Products not found!"
              description="We couldn’t find any products right now. Please check back later for new arrivals."
            />
          ) : (
            <>
              {productsResponse?.data?.data?.length === 0 ? (
                <NoDataFoundBySearchFilter
                  title="Products not found!"
                  description="We couldn’t find any products right now. Please check back later for new arrivals."
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3">
                  {productsResponse?.data?.data
                    .slice(0, 6)
                    .map((product: TProduct) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 mb-2 flex justify-center">
          <Link href={`/shop`}>
            <Button
              size="lg"
              variant="outline"
              className="border border-primary dark:border-primary text-primary"
            >
              View All
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default RecentProducts;
