import React, { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Category } from "../new/page";
import { CategoriesSelect } from "./CategoriesSelect";
import { supabase } from "../../../utils/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import { useForm } from 'react-hook-form'

type FormValues = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
}

interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  isLoading = false,
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: title || '',
      content: content || '',
      thumbnailImageKey: thumbnailImageKey || '',
      categories: categories || [],
    }
  })

  // フォームの値を監視して親コンポーネントと同期
  const formTitle = watch("title")
  const formContent = watch("content")
  const formThumbnailImageKey = watch("thumbnailImageKey")
  const formCategories = watch("categories")

  useEffect(() => {
    if (formTitle !== title) {
      setTitle(formTitle)
    }
  }, [formTitle, setTitle, title])

  useEffect(() => {
    if (formContent !== content) {
      setContent(formContent)
    }
  }, [formContent, setContent, content])

  useEffect(() => {
    if (formThumbnailImageKey !== thumbnailImageKey) {
      setThumbnailImageKey(formThumbnailImageKey)
    }
  }, [formThumbnailImageKey, setThumbnailImageKey, thumbnailImageKey])

  useEffect(() => {
    if (JSON.stringify(formCategories) !== JSON.stringify(categories)) {
      setCategories(formCategories)
    }
  }, [formCategories, setCategories, categories])

  // 親コンポーネントの値が変更されたらフォームに反映
  useEffect(() => {
    setValue("title", title)
  }, [title, setValue])

  useEffect(() => {
    setValue("content", content)
  }, [content, setValue])

  useEffect(() => {
    setValue("thumbnailImageKey", thumbnailImageKey)
  }, [thumbnailImageKey, setValue])

  useEffect(() => {
    setValue("categories", categories)
  }, [categories, setValue])

  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  useEffect(() => {
    if (thumbnailImageKey) {
      // thumbnailImageKeyが完全なURLの場合はそのまま使用
      if (thumbnailImageKey.startsWith('http://') || thumbnailImageKey.startsWith('https://')) {
        setThumbnailImageUrl(thumbnailImageKey)
      } else {
        // パスの場合はgetPublicUrlでURLを生成（同期的に実行可能）
        const { data: { publicUrl } } = supabase.storage
          .from('post_thumbnail')
          .getPublicUrl(thumbnailImageKey)
        setThumbnailImageUrl(publicUrl)
      }
    } else {
      setThumbnailImageUrl(null)
    }
  }, [thumbnailImageKey])

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error || !data) {
      alert(error?.message ?? "画像アップロードに失敗しました");
      return;
    }

    // 公開URLを取得してフォームと親コンポーネントに設定
    const { data: urlData } = supabase.storage
      .from("post_thumbnail")
      .getPublicUrl(data.path);

    setValue("thumbnailImageKey", data.path, { shouldValidate: true });
    setThumbnailImageKey(data.path);
    setThumbnailImageUrl(urlData.publicUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          {...register("title", { required: "タイトルは必須です" })}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
        {errors.title?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          {...register("content", { required: "内容は必須です" })}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
        {errors.content?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
        />
        {/* 非表示フィールドでthumbnailImageKeyを管理 */}
        <input
          type="hidden"
          {...register("thumbnailImageKey", { required: "サムネイルは必須です" })}
        />
        {errors.thumbnailImageKey?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.thumbnailImageKey.message}</p>
        )}
        {/* 画像の表示 */}
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="thumbnailUrl"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={formCategories}
          setSelectedCategories={(newCategories) => {
            setValue("categories", newCategories);
            setCategories(newCategories);
          }}
        />
        {errors.categories && (
          <p className="mt-1 text-sm text-red-600">カテゴリーを選択してください</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mode === "new" ? "作成" : "更新"}
      </button>
      {mode === "edit" && (
        <button
          type="button"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          onClick={onDelete}
        >
          {isLoading ? "処理中..." : "削除"}
        </button>
      )}
    </form>
  );
};
