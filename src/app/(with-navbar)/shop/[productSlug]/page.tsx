import {
  getAllProductsFromDB,
  getSingleProductFromDB,
} from "@/app/actions/product";
import { getMeFromDB } from "@/app/actions/users";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import ProductGallery from "@/components/common/Product/ProductGallery";
import { Rating } from "@/components/common/Product/Rating";
import Container from "@/components/shared/Ui/Container";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TProduct } from "@/types";
import { stripHtml, truncateText } from "@/utils/conversion";
import { RotateCcw, Shield, Truck } from "lucide-react";
import ProductShortSummary from "./_components/ProductShortSummary";
import RelatedProducts from "./_components/RelatedProducts";
import { ReviewsSection } from "./_components/ReviewsSection";

export async function generateMetadata(props: {
  params: Promise<{ productSlug: string }>;
}) {
  const params = await props.params;
  const productSlug = params?.productSlug;

  const singleProductResponse = await getSingleProductFromDB(productSlug);

  if (!singleProductResponse?.success) {
    return {
      title: "Product not found!",
      description: "This product does not exist in this shop.",
    };
  }

  const plainDescription = truncateText(
    stripHtml(singleProductResponse?.data?.description),
    40
  );

  return {
    title: `${singleProductResponse?.data?.name} | Pushtihub`,
    description: plainDescription,
    openGraph: {
      title: singleProductResponse?.data?.name,
      description: plainDescription,
      images: [
        {
          url: singleProductResponse?.data?.images[0],
          width: 600,
          height: 600,
          alt: singleProductResponse?.data?.name,
        },
      ],
    },
  };
}

type TProductDetailsPageParams = {
  rating?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

const MANAGE_REVIEWS_DATA_LIMIT = "3";

const ProductDetailPage = async (props: {
  params: Promise<{ productSlug: string }>;
  searchParams: Promise<TProductDetailsPageParams>;
}) => {
  const params = await props.params;
  const productSlug = params?.productSlug;

  const searchParams = await props?.searchParams;

  const {
    rating,
    page = "1",
    limit = MANAGE_REVIEWS_DATA_LIMIT,
    sort,
  } = searchParams || {};

  const paramsObj: Record<string, string> = {};

  if (rating) {
    paramsObj.rating = rating;
  }
  if (page) {
    paramsObj.page = page;
  }
  if (limit) {
    paramsObj.limit = limit;
  }
  if (sort) {
    paramsObj.sort = sort;
  }

  const user = await getMeFromDB();

  const singleProductResponse = await getSingleProductFromDB(productSlug);

  if (!singleProductResponse.success || !singleProductResponse.data) {
    return (
      <NoDataFound
        title={`Product with the slug '${productSlug}' is not found!`}
        description="We couldn’t find any product right now. Please check back later for new arrivals."
      />
    );
  }
  const product: TProduct = singleProductResponse?.data;

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <Breadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.name, href: `/shop/${product.slug}` },
          ]}
          isStart={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Image Gallery */}
          <div className="">
            <ProductGallery images={product.images} />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6 justify-start">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold mb-2">
                {product.name}
              </h1>
              <Rating
                rating={product.averageRatings}
                totalReviews={product.totalReviews}
                size="md"
              />
            </div>

            <ProductShortSummary product={product} />

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center space-y-2">
                <Truck className="h-6 w-6 mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center space-y-2">
                <Shield className="h-6 w-6 mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center space-y-2">
                <RotateCcw className="h-6 w-6 mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12 bg-transparent ">
          <TabsList className="w-full md:w-[400px] justify-start rounded-md bg-transparent h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-3 cursor-pointer"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-3 cursor-pointer"
            >
              Reviews ({product.totalReviews})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card className="p-6">
              <div
                className="prose dark:prose-invert max-w-none html-content text-justify"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <ReviewsSection
              product={product}
              averageRating={product.averageRatings}
              totalReviews={product.totalReviews}
              userId={user?.data?.user._id}
              paramsObj={paramsObj}
              MANAGE_REVIEWS_DATA_LIMIT={MANAGE_REVIEWS_DATA_LIMIT}
            />
          </TabsContent>
        </Tabs>

        {/* related products */}
        <RelatedProducts tags={product.tags} />
      </Container>
    </div>
  );
};

export default ProductDetailPage;

export async function generateStaticParams() {
  try {
    const productsResponse = await getAllProductsFromDB();

    return (
      productsResponse?.data?.data?.map((product: TProduct) => ({
        productSlug: product.slug,
      })) ?? []
    );
  } catch {
    return [];
  }
}
