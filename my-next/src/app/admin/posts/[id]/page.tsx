"use client"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Post } from '../../../_types/Post'
import { Category } from '../../../_types/Category'
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useApiSWR } from "@/app/_hooks/useApiSWR";

export default function Page() {
  const [title, setTitle] = useState('');
  const [content,setContent]=useState('');
  const [thumbnailImageKey,setThumbnailImageKey]=useState('');
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()
 //更新ボタンを押したときの処理
  const handleSubmit = async(e:React.FormEvent) =>{
    e.preventDefault()
    setIsLoading(true)
    if (!token) return
    try {
      const res = await fetch(`/api/admin/posts/${id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
          Authorization: token,
        },
        body:JSON.stringify({title,content,thumbnailImageKey,categories})
      })

      if (!res.ok) { 
        const errorText = await res.text()
        throw new Error(`更新に失敗しました: ${res.status} - ${errorText}`)
      }

      alert('記事を更新しました。')
      router.push('/admin/posts') 
    } catch {
      alert("記事の更新に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }
  //削除ボタンを押したときの処理
  const handleDelete = async () => {
    if (!confirm('記事を削除しますか？')) return
    setIsLoading(true)
    try { 
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`削除に失敗しました: ${res.status} - ${errorText}`)
      }

      await res.json()
      alert('記事を削除しました。')
      router.push('/admin/posts')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`記事の削除に失敗しました: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }
  

  const { data, error, isLoading: isDataLoading } = useApiSWR<{ post: Post }>(
    id ? `/api/admin/posts/${id}` : null
  );

  useEffect(() => {
    if (data && data.post) {
      setTitle(data.post.title)
      setContent(data.post.content)
      setThumbnailImageKey(data.post.thumbnailImageKey)
      setCategories(data.post.postCategories.map((pc) => pc.category))
    }
  }, [data])

  useEffect(() => {
    if (error) {
      alert(error.message)
    }
  }, [error])
  

  return (
      <div className="main flex-1 pl-10 pr-10 pt-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">記事編集</h1>
        </div>
        <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      </div>
  );
}
