"use client";

import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

type TMTInputProps = {
  name: string;
  type?: string;
  placeholder: string;
};

const MYInput = ({ name, type = "text", placeholder }: TMTInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            type={type}
            placeholder={placeholder ?? ""}
            className={`py-[22px] px-4 rounded-md border ${
              errors[name]
                ? "border-red-500 dark:border-red-400"
                : "border-gray-200 dark:border-gray-700"
            } 
                text-gray-800 dark:text-gray-200 
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none hover:border-primary focus:border-primary
                transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark 
                
              `}
          />
        )}
      />
      {errors[name] && (
        <p className="text-red-600 text-sm 2xl:text-base mt-1">
          {(errors[name]?.message as string) || "Invalid input"}
        </p>
      )}
    </div>
  );
};

export default MYInput;
