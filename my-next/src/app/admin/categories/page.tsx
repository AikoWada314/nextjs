"use client"

import Link from "next/link";
import { Category } from "../../_types/Category";
import { useApiSWR } from "@/app/_hooks/useApiSWR";

export default function AdminCategory() {
  const { data, error, isLoading } = useApiSWR<{ categories: Category[] }>(
    "/api/admin/categories"
  );

  const categories = data?.categories || [];

  if (isLoading) return <div>読み込み中</div>;
  if (error) return <div>エラーが発生しました</div>;
  if (!categories || categories.length === 0) return <div>カテゴリーがありません</div>;

  return (
    <div className="main flex-1 pl-10 pr-10 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className="block bg-[#4169e1] pt-3 pb-3 pr-5 pl-5 text-white rounded-md">新規作成</Link>
      </div>
      <ul>
        {categories.map((category) => (
          <li key={category.id}  className="">
            <Link href={`/admin/categories/${category.id}`} className="border-b border-[#dcdcdc] pt-4 pb-4 pr-4 pl-4 block">
              <h2>{category.name}</h2>      
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
