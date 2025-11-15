"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TMYMultiSelectWithExtraProps = {
  name: string;
  options: string[];
  placeholder?: string;
};

const MYMultiSelectWithExtra = ({
  name,
  options,
  placeholder = "Select or add tags...",
}: TMYMultiSelectWithExtraProps) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedTags: string[] = watch(name) || [];
  const [open, setOpen] = useState(false);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setValue(name, [...selectedTags, tag]);
    }
    setOpen(false);
  };

  const removeTag = (tag: string) => {
    setValue(
      name,
      selectedTags.filter((t) => t !== tag)
    );
  };

  const hasError = !!errors[name];

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <div className="space-y-2">
          {/* Select Box */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="">
              <div
                className={`flex flex-wrap gap-2 p-2 min-h-[44px] w-full cursor-pointer
                  border rounded-md transition-all duration-200 ease-in-out
                  ${
                    hasError
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary focus-within:border-primary"
                  }
                  bg-light-gray dark:bg-deep-dark 2xl:text-lg`}
              >
                {selectedTags.length > 0 ? (
                  selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="flex items-center gap-1 text-white bg-primary hover:bg-primary/90 2xl:text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(tag);
                        }}
                        className="hover:text-gray-200 cursor-pointer"
                      >
                        <X className="w-3 h-3 2xl:w-4 2xl:h-4" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm 2xl:text-base text-gray-600 dark:text-gray-400 px-1">
                    {placeholder}
                  </span>
                )}
              </div>
            </PopoverTrigger>

            {/* Dropdown */}
            <PopoverContent
              align="start"
              className="p-3 w-full border border-gray-200 dark:border-gray-700 bg-light-gray dark:bg-deep-dark shadow-lg rounded-md"
            >
              <Command>
                <CommandInput
                  placeholder="Search or type a new tag..."
                  className=" focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      e.currentTarget.value.trim() !== ""
                    ) {
                      addTag(e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                      e.preventDefault();
                    }
                  }}
                />
                <CommandList>
                  <CommandEmpty className="py-2 text-gray-600 dark:text-gray-400 text-sm text-center">
                    No tags found. Press Enter to add.
                  </CommandEmpty>

                  {options.map((option) => (
                    <CommandItem
                      key={option}
                      className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onSelect={() => addTag(option)}
                    >
                      {option}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Error Message */}
          {hasError && (
            <p className="text-red-600 text-sm 2xl:text-base mt-1">
              {(errors[name]?.message as string) || "Invalid selection"}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default MYMultiSelectWithExtra;
