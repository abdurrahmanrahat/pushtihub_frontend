import ProductGallery from "@/components/common/Product/ProductGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TProduct } from "@/types/product.type";
import { slugToTitle } from "@/utils/createSlug";
import {
  Calendar,
  Eye,
  Package,
  Pencil,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProductDetailsModal = ({ product }: { product: TProduct }) => {
  return (
    <Dialog>
      {/* Trigger button (eye icon) */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="!max-w-4xl max-h-[90vh] overflow-y-auto scroll-hidden"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        {/* <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader> */}

        <div className="grid gap-6 md:grid-cols-2 place-items-center">
          {/* Image Gallery */}
          <ProductGallery images={product?.images} />

          {/* Product Details */}
          <div className="space-y-2 lg:space-y-3">
            <h2 className="text-base md:text-lg 2xl:text-xl font-semibold">
              {product.name}
            </h2>

            {/* Price Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-semibold text-primary">
                  ${product.sellingPrice}
                </span>
                {product.price !== product.sellingPrice && (
                  <span className="text-lg md:text-xl text-gray-600 dark:text-gray-400 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
              {product.price !== product.sellingPrice && (
                <Badge variant="destructive" className="bg-primary">
                  Save ${product.price - product.sellingPrice}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Stock</span>
                </div>
                <p className="text-lg font-semibold">{product.stock} Items</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Sales</span>
                </div>
                <p className="text-lg font-semibold">
                  {product.salesCount} Sold
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">Rating</span>
                </div>
                <div className="lg:flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.averageRatings)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {product.averageRatings.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.totalReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">Category</span>
                </div>
                <p className="text-sm">{slugToTitle(product.category)}</p>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Metadata */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(product.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 mt-4">
          <h3 className="text-lg xl:text-xl 2xl:text-2xl font-semibold">
            Product Description
          </h3>
          <div
            className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground html-content"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/dashboard/admin/manage-products/${product._id}`}
            className="flex-1 w-full"
          >
            <Button className="bg-primary w-full hover:bg-primary/90">
              <Pencil className="mr-1 md:mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>

          <DialogClose asChild>
            <Button variant="outline" className="flex-1 w-full">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
