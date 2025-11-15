import { Star } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TMYRatingProps = {
  name: string;
};

const MYRating = ({ name }: TMYRatingProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [hoveredRating, setHoveredRating] = useState<number>(0);

  return (
    <div className="">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors cursor-pointer ${
                    star <= (hoveredRating || value)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm 2xl:text-base mt-1">
          {(errors[name]?.message as string) || "Rating is required"}
        </p>
      )}
    </div>
  );
};

export default MYRating;
