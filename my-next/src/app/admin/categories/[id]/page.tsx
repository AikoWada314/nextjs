"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export default function CategoryEdit() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { token } = useSupabaseSession();

  const fetcher = async (url: string): Promise<{ category: { name: string } }> => {
    if (!token) throw new Error('認証トークンがありません');
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (!res.ok) throw new Error("データ取得に失敗しました");
    return res.json();
  };

  const { data, error, isLoading: isDataLoading } = useSWR<{ category: { name: string } }>(
    id && token ? `/api/admin/categories/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (data && data.category) {
      setName(data.category.name);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      alert(error.message);
    }
  }, [error]);

  if (!id) return <p>Loading...</p>;
  if (isDataLoading) return <p>読み込み中...</p>;

  // 更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({ name }),
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

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
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
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
