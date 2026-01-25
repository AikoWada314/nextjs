"use client"

import useSWR from "swr"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"

interface UseApiSWROptions {
  requireAuth?: boolean // 認証が必要かどうか（デフォルト: true）
}

export const useApiSWR = <T = any>(
  url: string | null,
  options: UseApiSWROptions = { requireAuth: true }
) => {
  const { token } = useSupabaseSession()
  const { requireAuth = true } = options

  const fetcher = async (url: string): Promise<T> => {
    // 認証が必要な場合のみトークンチェック
    if (requireAuth && !token) {
      throw new Error('認証トークンがありません')
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // 認証が必要な場合のみAuthorizationヘッダーを追加
    if (requireAuth && token) {
      headers.Authorization = token
    }

    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error('データ取得に失敗しました')
    const data = await res.json()
    return data
  }

  // 認証が必要な場合はtokenが存在するまで待つ、不要な場合は即座にフェッチ
  const shouldFetch = requireAuth ? (url && token) : url

  const { data, error, isLoading } = useSWR<T>(
    shouldFetch ? url : null,
    fetcher
  )

  return { data, error, isLoading }
}
