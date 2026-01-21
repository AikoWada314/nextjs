"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreateCategoryRequestBody } from '@/app/api/admin/categories/route'


export default function CategoryNew() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    if (!token) return;

    try {
      setIsLoading(true)

      const body: CreateCategoryRequestBody = { name }

      // カテゴリーを作成します。
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(body),
      })

      // レスポンスから作成したカテゴリーのIDを取得します。
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
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        ></CategoryForm>
      </div>
    </div>
  );
}
