'use client'

import { supabase } from '@/app/utils/supabase'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      
      if (error) {
        setMessage(`登録に失敗しました: ${error.message}`)
      } else {
        setEmail('')
        setPassword('')
        setMessage('確認メールを送信しました。メールをご確認ください。')
      }
    } catch (error) {
      setMessage('予期しないエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[400px]">
        {message && (
          <div
            className={`p-4 text-sm rounded-lg ${
              message.includes('失敗') || message.includes('エラー')
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {message}
          </div>
        )}
        
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50"
            placeholder="name@company.com"
            required
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50"
            required
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登録中...' : '登録'}
          </button>
        </div>
      </form>
    </div>
  )
}