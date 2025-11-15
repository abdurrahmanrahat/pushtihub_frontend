import { getAllProductsFromDB } from "@/app/actions/product";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import { TProduct } from "@/types";
import { ProductCard } from "../../_components/ProductCard";

const RelatedProducts = async ({ tags }: { tags: string[] }) => {
  const tagsInString = tags.join(",");

  const productsResponse = await getAllProductsFromDB({ tags: tagsInString });

  return (
    <div className="my-8 mt-12">
      <h4 className="text-2xl font-semibold mb-8">Related Products</h4>

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
              description="There is no similar products available now — will appear once added."
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
  );
};

export default RelatedProducts;
