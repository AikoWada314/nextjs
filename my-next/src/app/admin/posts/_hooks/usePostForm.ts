"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import type { Category } from "../../../_types/Category";

export type PostFormValues = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
};

interface UsePostFormOptions {
  defaultValues?: Partial<PostFormValues>;
}

export const usePostForm = (
  options?: UsePostFormOptions
): UseFormReturn<PostFormValues> => {
  return useForm<PostFormValues>({
    defaultValues: {
      title: "",
      content: "",
      thumbnailImageKey: "",
      categories: [],
      ...options?.defaultValues,
    },
  });
};

