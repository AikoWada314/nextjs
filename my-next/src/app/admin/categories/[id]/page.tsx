'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'



export default function CategoryEdit() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  //useParamsの初期化
  const { id } = useParams()
  const router = useRouter()

    //更新ボタンを押したときの処理
    const handleSubmit = async(e:React.FormEvent) =>{
      e.preventDefault()
      setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/categories/${id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({name})
      })
  
      if (!res.ok) {
        throw new Error('更新に失敗しました')
      }

      alert('カテゴリーを更新しました。')
      router.push('/admin/categories')

      } catch (error) {
        alert(`カテゴリーの更新に失敗しました: ${error.message}`)
      }
      finally {
        setIsLoading(false)
      }
    }

    //削除ボタンを押したときの処理
    const handleDelete = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`削除に失敗しました: ${res.status} - ${errorText}`)
      }

      const data = await res.json()
      alert('カテゴリーを削除しました。')
      router.push('/admin/categories')

    } catch (error) {
      alert(`カテゴリーの削除に失敗しました: ${error.message}`)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetcher = async() =>{
      const res = await fetch(`/api/admin/categories/${id}`)
      const { category } = await res.json()
      setName(category.name)
    }

    fetcher()
  }, [id])

  return (
    <div className="main flex-1 pl-10 pr-10 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">カテゴリー編集</h1>
      </div>
      <div className="">
        <CategoryForm mode="edit" name={name} setName={setName} onSubmit={handleSubmit} onDelete={handleDelete} isLoading={isLoading}>
        </CategoryForm>
      </div>
    </div>
  );
}
