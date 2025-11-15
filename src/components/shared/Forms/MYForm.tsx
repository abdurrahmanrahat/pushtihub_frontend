"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";
import { z, ZodTypeAny } from "zod";

type TFormProps<TSchema extends ZodTypeAny> = {
  children: ReactNode;
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  defaultValues: UseFormProps<z.infer<TSchema>>["defaultValues"];
  schema: TSchema;
};

const MYForm = <TSchema extends ZodTypeAny>({
  children,
  onSubmit,
  defaultValues,
  schema,
}: TFormProps<TSchema>) => {
  const methods = useForm<z.infer<TSchema>>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const submit: SubmitHandler<z.infer<TSchema>> = (data) => {
    onSubmit(data);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)}>{children}</form>
    </FormProvider>
  );
};

export default MYForm;
