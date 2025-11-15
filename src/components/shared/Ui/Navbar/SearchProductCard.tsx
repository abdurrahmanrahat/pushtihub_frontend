import { TProduct } from "@/types";
import MyImage from "../Image/MyImage";

type TSearchProductCardProps = {
  product: TProduct;
  onCardClick: (productSlug: string) => void;
};

const SearchProductCard = ({
  product,
  onCardClick,
}: TSearchProductCardProps) => {
  return (
    <div
      className="grid grid-cols-12 gap-2 items-center cursor-pointer"
      onClick={() => onCardClick(product.slug)}
    >
      <div className="col-span-3">
        <MyImage
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name.slice(0, 6)}
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
      </div>

      <div className="col-span-9 space-y-1 2xl:space-y-[2px]">
        <h3 className="text-sm 2xl:text-base line-clamp-2 text-gray-700 dark:text-gray-200">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm 2xl:text-base font-semibold text-primary">
            ${product.sellingPrice.toFixed(2)}
          </span>
          {product.price > product.sellingPrice && (
            <span className="text-xs 2xl:text-sm text-gray-600 dark:text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProductCard;
