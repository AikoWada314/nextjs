"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { CreatePostResponse, CreatePostRequestBody } from "@/app/api/admin/posts/route";

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!token) return;
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title, content, thumbnailImageKey, categories } satisfies CreatePostRequestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`作成に失敗しました: ${res.status} - ${errorText}`);
      }

      const { id }: CreatePostResponse = await res.json();

      alert("記事を作成しました。");
      router.push(`/admin/posts/${id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`記事の作成に失敗しました: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main flex-1 pl-10 pr-10 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">記事作成</h1>
      </div>
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
