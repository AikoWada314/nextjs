"use client";

import { useForm, UseFormReturn } from "react-hook-form";

export type CategoryFormValues = {
  name: string;
};

interface UseCategoryFormOptions {
  defaultValues?: Partial<CategoryFormValues>;
}

export const useCategoryForm = (
  options?: UseCategoryFormOptions
): UseFormReturn<CategoryFormValues> => {
  return useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      ...options?.defaultValues,
    },
  });
};

