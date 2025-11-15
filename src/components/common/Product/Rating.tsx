import { Star } from "lucide-react";

type TRatingProps = {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
};

export const Rating = ({
  rating,
  totalReviews = 0,
  size = "md",
  showCount = true,
}: TRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const partial = rating > star - 1 && rating < star;
          const fillPercentage = (rating - (star - 1)) * 100;

          return (
            <div key={star} className="relative">
              {/* Base star outline (always visible border) */}
              <Star
                className={`${sizeClasses[size]} text-yellow-500`}
                strokeWidth={1.5}
              />

              {/* Filled portion overlay */}
              {(filled || partial) && (
                <Star
                  className={`${sizeClasses[size]} text-yellow-500 fill-yellow-500 absolute top-0 left-0`}
                  style={
                    partial
                      ? { clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }
                      : undefined
                  }
                  strokeWidth={1.5}
                />
              )}
            </div>
          );
        })}
      </div>

      {showCount && totalReviews > 0 && (
        <span className={`${textSizes[size]}`}>({totalReviews})</span>
      )}
    </div>
  );
};
