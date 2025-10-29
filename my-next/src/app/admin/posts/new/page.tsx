"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import AdminBar from "../../_components/AdminBar";

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const [title, setTitle] = useState('');
  const [content,setContent]=useState('');
  const [thumbnailUrl,setThumbnailUrl]=useState('https://placehold.jp/800x400.png');
  const [categories, setCategories] = useState<Category[]>([])

  const router = useRouter()

  const handleSubmit = async(e:React.FormEvent) =>{
    e.preventDefault()

    const res = await fetch('/api/admin/posts',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({title,content,thumbnailUrl,categories})
    })

      const { id } = await res.json()

      router.push(`/admin/posts/${id}`)

      alert('記事を作成しました。')
  }

  

  return (
     <div className="flex min-h-screen">
      <AdminBar />
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
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
      />
      </div>
     </div>
  );
}
