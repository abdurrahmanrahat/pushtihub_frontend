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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TProduct } from "@/types";
import { stripHtml, truncateText } from "@/utils/conversion";
import { slugToTitle } from "@/utils/createSlug";
import { RotateCcw, Shield, Tag, Truck } from "lucide-react";
import ProductActions from "./_components/ProductActions";
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
    title: `${singleProductResponse?.data?.name} | Gadgetoria`,
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

  const discount =
    product.price > product.sellingPrice
      ? Math.round(
          ((product.price - product.sellingPrice) / product.price) * 100
        )
      : 0;

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
          <div className="relative">
            <ProductGallery images={product.images} />

            {discount > 0 && (
              <div className="absolute top-4 left-4">
                <Badge
                  variant="destructive"
                  className="font-semibold uppercase"
                >
                  -{discount}% OFF
                </Badge>
              </div>
            )}
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

            <div className="flex items-baseline gap-3">
              <span className="text-lg md:text-2xl font-semibold text-primary">
                ${product.sellingPrice}
              </span>
              {product.price > product.sellingPrice && (
                <span className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="">
                <p className="text-sm font-medium text-muted-foreground">
                  Category:{" "}
                  <span className="font-semibold text-foreground">
                    {slugToTitle(product.category)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* actions */}
            <ProductActions product={product} />

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
