"use client"

import Link from "next/link";
import { Post } from "../../_types/Post";
import { useApiSWR } from "@/app/_hooks/useApiSWR";
import type { PostIndexResponse } from "@/app/api/admin/posts/route";

export default function AdminPage() {

  const { data, error, isLoading } = useApiSWR<PostIndexResponse>(
    "/api/admin/posts"
  );

  const posts = data?.posts ?? [];

  if (isLoading) return <div>読み込み中</div>;
  if (error) return <div>エラーが発生しました</div>;
  if (posts.length === 0) return <div>投稿がありません</div>;

  return (
    <div className="main flex-1 pl-10 pr-10 pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">記事一覧</h1>
        <Link href="/admin/posts/new" className="block bg-[#4169e1] pt-3 pb-3 pr-5 pl-5 text-white rounded-md">新規作成</Link>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}  className="">
            <Link href={`/admin/posts/${post.id}`} className="border-b border-[#dcdcdc] pt-4 pb-4 pr-4 pl-4 block">
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  {post.postCategories && post.postCategories.length > 0 && 
                    post.postCategories.map((postCategory) => (
                      <p key={postCategory.category.id}>
                        {postCategory.category.name}
                      </p>
                    ))
                  }
              <h2 className="text-2xl font-medium">{post.title}</h2>                
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
