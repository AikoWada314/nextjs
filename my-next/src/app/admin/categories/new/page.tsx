'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'


export default function CategoryNew() {
  const [name, setName] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async(e:React.FormEvent) =>{
      e.preventDefault()
      setIsLoading(true)

      try {
        const res = await fetch('/api/admin/categories',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({name})
      })
  
        const { id } = await res.json()
  
        router.push('/admin/categories')
  
        alert('カテゴリーを作成しました。')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`カテゴリーの作成に失敗しました: ${errorMessage}`)
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
          <CategoryForm mode="new" name={name} setName={setName} onSubmit={handleSubmit} isLoading={isLoading}>
          </CategoryForm>
        </div>
    </div>
  );
}
