"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm, CategoryFormValues } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useApiSWR } from "@/app/_hooks/useApiSWR";
import type { CategoryShowResponse, UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useForm } from "react-hook-form";

export default function CategoryEdit() {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { token } = useSupabaseSession();

  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
    },
  });

  const { reset } = form;

  const { data, error, isLoading: isDataLoading } = useApiSWR<CategoryShowResponse>(
    id ? `/api/admin/categories/${id}` : null
  );

  useEffect(() => {
    if (data && data.category) {
      reset({
        name: data.category.name,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (error) {
      alert(error.message);
    }
  }, [error]);

  if (!id) return <p>Loading...</p>;
  if (isDataLoading) return <p>読み込み中...</p>;

  // 更新
  const handleSubmit = async (values: CategoryFormValues) => {
    setIsLoading(true);

    if (!token) {
      setIsLoading(false)
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ,
        },
        body: JSON.stringify(values satisfies UpdateCategoryRequestBody),
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }

      alert("カテゴリーを更新しました。");
      router.push("/admin/categories");
    } catch (error) {
      if (error instanceof Error) {
        alert(`カテゴリーの更新に失敗しました: ${error.message}`);
      } else {
        alert("カテゴリーの更新に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 削除
  const handleDelete = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;

    setIsLoading(true);

    if (!token) {
      setIsLoading(false)
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`削除に失敗しました: ${res.status} - ${errorText}`);
      }

      alert("カテゴリーを削除しました。");
      router.push("/admin/categories");
    } catch (error) {
      if (error instanceof Error) {
        alert(`カテゴリーの削除に失敗しました: ${error.message}`);
      } else {
        alert("カテゴリーの削除に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main flex-1 pl-10 pr-10 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">カテゴリー編集</h1>
      </div>

    <CategoryForm 
      mode="edit" 
      form={form} 
      onSubmit={handleSubmit} 
      onDelete={handleDelete} 
      isLoading={isLoading} 
      />
    </div>
  );
}
