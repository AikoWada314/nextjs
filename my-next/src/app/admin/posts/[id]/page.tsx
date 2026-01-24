"use client"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostForm, PostFormValues } from "../_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useApiSWR } from "@/app/_hooks/useApiSWR";
import { useForm } from "react-hook-form";
import type { PostShowResponse, UpdatePostRequestBody } from "@/app/api/admin/posts/[id]/route";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      content: "",
      thumbnailImageKey: "",
      categories: [],
    },
  });

  const { reset } = form;

  const { data, error } = useApiSWR<PostShowResponse>(
    id ? `/api/admin/posts/${id}` : null
  );

  useEffect(() => {
    if (!data?.post) return;

    reset({
      title: data.post.title,
      content: data.post.content,
      thumbnailImageKey: data.post.thumbnailImageKey,
      categories: data.post.postCategories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        createdAt: "",
        updatedAt: "",
      })),
    });
  }, [data?.post, reset]);

  useEffect(() => {
    if (error) alert(error.message);
  }, [error]);

  const handleSubmit = async (values: PostFormValues) => {
    setIsLoading(true);
    if (!token) return;

    try {
      const body = {
        title: values.title,
        content: values.content,
        thumbnailImageKey: values.thumbnailImageKey,
        categories: values.categories,
      } satisfies UpdatePostRequestBody;

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`更新に失敗しました: ${res.status} - ${errorText}`);
      }

      alert("記事を更新しました。");
      router.push("/admin/posts");
    } catch {
      alert("記事の更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("記事を削除しますか？")) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
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

      await res.json();
      alert("記事を削除しました。");
      router.push("/admin/posts");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`記事の削除に失敗しました: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main flex-1 pl-10 pr-10 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        form={form} 
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
