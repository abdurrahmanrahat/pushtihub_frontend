"use client";

import { Controller, useFormContext } from "react-hook-form";
import TextEditor from "../Ui/TextEditor/TextEditor";

type TMYTextEditorProps = {
  name: string;
};

const MYTextEditor = ({ name }: TMYTextEditorProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name];

  return (
    <div className="flex flex-col">
      <div className={``}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <TextEditor
              content={field.value || ""}
              hasError={hasError}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {hasError && (
        <p className="text-red-600 text-sm 2xl:text-base mt-1">
          {(errors[name]?.message as string) || "Invalid input"}
        </p>
      )}
    </div>
  );
};

export default MYTextEditor;
