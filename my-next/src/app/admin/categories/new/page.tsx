"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreateCategoryRequestBody } from '@/app/api/admin/categories/route'
import { useCategoryForm, type CategoryFormValues } from "../_hooks/useCategoryForm";


export default function CategoryNew() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSupabaseSession();
  const form = useCategoryForm()

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!token) return;
    

    try {
      setIsLoading(true)
      const body: CreateCategoryRequestBody = { name: values.name }

      // カテゴリーを作成します。
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`作成に失敗しました: ${res.status} - ${errorText}`);
      }      
      const { id } = await res.json()

      

      // 作成したカテゴリーの詳細ページに遷移します。
      router.push(`/admin/categories/${id}`)

      alert('カテゴリーを作成しました。')
    } catch (error) {
      console.error('カテゴリーの作成に失敗しました:', error)
      alert('カテゴリーの作成に失敗しました。')
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <div className="main flex-1 pl-10 pr-10 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">カテゴリー作成</h1>
      </div>
      <div className="">
        <CategoryForm
          mode="new"
          form={form}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        ></CategoryForm>
      </div>
    </div>
  );
}
