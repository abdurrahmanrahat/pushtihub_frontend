import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

type TQuantityStepperProps = {
  value: number;
  onChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
};

export const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = 20,
}: TQuantityStepperProps) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 md:h-8 md:w-8 2xl:w-9 2xl:h-9 hover:bg-primary hover:text-white transition-all duration-300"
        onClick={handleDecrement}
        disabled={value <= min}
      >
        <Minus className="h-3 w-3 md:h-4 md:w-4 2xl:h-6 2xl:w-6" />
      </Button>
      <span className="min-w-[1rem] md:min-w-[2rem] text-center font-medium 2xl:text-lg">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 md:h-8 md:w-8 2xl:w-9 2xl:h-9 hover:bg-primary hover:text-white transition-all duration-300"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        <Plus className="h-3 w-3 md:h-4 md:w-4 2xl:h-6 2xl:w-6" />
      </Button>
    </div>
  );
};
