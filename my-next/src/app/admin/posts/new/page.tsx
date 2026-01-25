"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { CreatePostResponse, CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { PostForm } from "../_components/PostForm";
import { usePostForm, type PostFormValues } from "../_hooks/usePostForm";

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const form = usePostForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  
  const handleSubmit = async (values: PostFormValues) => {
    setIsLoading(true);
    if (!token) {
      setIsLoading(false)
      return;
    }
    try {
      const body = {
        title: values.title,
        content: values.content,
        thumbnailImageKey: values.thumbnailImageKey,
        categories: values.categories,
      } satisfies CreatePostRequestBody;

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) { 
        throw new Error("記事の作成に失敗しました");
      }
      alert("記事を作成しました。");
      const { id }: CreatePostResponse = await res.json();
      router.push(`/admin/posts/${id}`); 
    } 
    catch (error) {
      alert("記事の作成に失敗しました");
    }
    finally {
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
        form={form} 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
