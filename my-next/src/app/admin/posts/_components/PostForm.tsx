import React, { useState, ChangeEvent, useEffect } from 'react'
import Image from 'next/image'
import { Category } from '../new/page'
import { CategoriesSelect } from './CategoriesSelect' 
import { supabase } from '../../../utils/supabase'
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ

interface Props {
  mode:'new' | 'edit'
  title:string
  setTitle: (title: string) => void
  content:string
  setContent:(content:string) => void
  thumbnailUrl: string
  setThumbnailUrl: (thumbnailUrl: string) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
  isLoading?: boolean
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  isLoading = false,
}) => {
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string>('')

  // 既存のthumbnailUrlがある場合は初期値として設定
  useEffect(() => {
    if (thumbnailUrl) {
      setThumbnailImageUrl(thumbnailUrl)
    }
  }, [thumbnailUrl])

  useEffect(() => {
    if (!thumbnailImageKey) return

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]
    const filePath = `private/${uuidv4()}`

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示して終了
    if (error || !data) {
      alert(error?.message ?? '画像アップロードに失敗しました')
      return
    }

    // 公開URLを取得して親コンポーネントに渡す
    const { data: urlData } = supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(data.path)

    setThumbnailImageKey(data.path)
    setThumbnailUrl(urlData.publicUrl)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          disabled={isLoading}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          value={content}
          disabled={isLoading}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
      　　<label
      　　htmlFor="thumbnailImageKey"
      　　className="block text-sm font-medium text-gray-700"
      >
      　　サムネイルURL
      </label>
      <input type="file" id="thumbnailImageKey" onChange={handleImageChange}　accept="image/*" />
      {/* 画像の表示 */}
      {thumbnailImageUrl && (
        <div className="mt-2">
          <Image
            src={thumbnailImageUrl}
            alt="thumbnail"
            width={400}
            height={400}
          />
        </div>
      )}
      </div>
      <div>
        <label
          htmlFor="thumbnailUrl"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          onClick={onDelete}
        >
           {isLoading ? '処理中...' : '削除'}
        </button>
      )}
    </form>
  )
}