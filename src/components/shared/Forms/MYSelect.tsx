"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

type TMYSelectOption = {
  label: string;
  value: string;
};

type TMYSelectProps = {
  name: string;
  options: TMYSelectOption[];
  placeholder?: string;
};

const MYSelect = ({ name, options, placeholder }: TMYSelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="flex flex-col">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              className={cn(
                // Base style
                "h-11 w-full cursor-pointer rounded-md text-sm transition-all duration-200 ease-in-out",
                "text-foreground placeholder:text-muted-foreground text-gray-800 dark:text-gray-200",
                "border focus:outline-none focus:ring-0",
                "hover:border-primary focus:border-primary",
                "dark:bg-deep-dark dark:text-gray-100 dark:placeholder:text-gray-500",
                // Dynamic error border
                error
                  ? "border-red-500 dark:border-red-400 focus:border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className=" ">
              {options.length > 0 ? (
                <>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={cn(
                        "cursor-pointer text-sm transition-colors duration-200",
                        "hover:bg-primary/10 focus:bg-primary/10 focus:text-primary",
                        "dark:hover:bg-primary/10 dark:focus:bg-primary/10"
                      )}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-sm font-medium p-4 text-center text-gray-600 dark:text-gray-300">
                      Add parent category first!
                    </h2>
                  </div>
                </>
              )}
            </SelectContent>
          </Select>
        )}
      />

      {error && (
        <p className="text-sm 2xl:text-base text-red-500 mt-1">
          {(error?.message as string) || "Invalid selection"}
        </p>
      )}
    </div>
  );
};

export default MYSelect;
