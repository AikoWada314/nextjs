"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import type { UseFormReturn } from "react-hook-form";

import { CategoriesSelect } from "./CategoriesSelect";
import { supabase } from "../../../utils/supabase";
import { useApiSWR } from "@/app/_hooks/useApiSWR";
import type { PostFormValues } from "../_hooks/usePostForm";

interface Props {
  mode: "new" | "edit";
  form: UseFormReturn<PostFormValues>;
  onSubmit: (values: PostFormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const PostForm: React.FC<Props> = ({
  mode,
  form,
  onSubmit,
  onDelete,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedCategories = watch("categories");
  const thumbnailImageKey = watch("thumbnailImageKey");
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);
  const { data: imageData } = useApiSWR<{ url: string }>(
    thumbnailImageKey ? `/api/admin/posts/${thumbnailImageKey}` : null
  );

  useEffect(() => {
    if (!imageData?.url) return;
    setThumbnailImageUrl((prev) => (prev === null ? imageData.url : prev));
  }, [imageData?.url]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError || !uploadData) {
      alert(uploadError?.message ?? "画像アップロードに失敗しました");
      return;
    }
    setValue("thumbnailImageKey", uploadData.path, { shouldValidate: true });

    const { data: urlData } = supabase.storage
      .from("post_thumbnail")
      .getPublicUrl(uploadData.path);

    setThumbnailImageUrl(urlData.publicUrl);

    event.target.value = "";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          {...register("title", { required: "タイトルは必須です" })}
        />
        {errors.title?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          内容
        </label>
        <textarea
          id="content"
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          {...register("content", { required: "内容は必須です" })}
        />
        {errors.content?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          サムネイル
        </label>

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          disabled={isLoading}
        />

        <input
          type="hidden"
          {...register("thumbnailImageKey", { required: "サムネイルは必須です" })}
        />
        {errors.thumbnailImageKey?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.thumbnailImageKey.message}</p>
        )}

        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image src={thumbnailImageUrl} alt="thumbnail" width={400} height={400} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          カテゴリー
        </label>

        <CategoriesSelect
          selectedCategories={selectedCategories}
          setSelectedCategories={(cats) =>
            setValue("categories", cats, { shouldValidate: true })
          }
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {mode === "new" ? "作成" : "更新"}
      </button>

      {mode === "edit" && (
        <button
          type="button"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 ml-2"
          onClick={onDelete}
        >
          {isLoading ? "処理中..." : "削除"}
        </button>
      )}
    </form>
  );
};
