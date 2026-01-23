"use client"

import Link from "next/link";
import parse from "html-react-parser";
import classes from "./page.module.css";
import type { Post } from './_types/Post';
import { useApiSWR } from "./_hooks/useApiSWR";

export default function BlogList() {
  const { data, error, isLoading } = useApiSWR<{ status: string; posts: Post[] }>(
    '/api/posts',
    { requireAuth: false } // 認証不要のAPI
  );

  const posts = data?.posts || [];

  if (isLoading) return <div>読み込み中</div>;
  
  if (!Array.isArray(posts)) {
    console.error('posts is not an array:', posts);
    return <div>データの形式が正しくありません</div>;
  }
  
  if (posts.length === 0) return <div>投稿がありません</div>;

  return (
    <ul className={classes.blogList}>
      {posts.map((post) => (
        <li key={post.id} className={classes.blogItem}>
          <Link href={`/posts/${post.id}`} className={classes.blogLink}>
            <div className={classes.blogMeta}>
              <p className={classes.blogDate}>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <ul className={classes.blogCategories}>
                {post.postCategories && post.postCategories.length > 0 && 
                  post.postCategories.map((postCategory) => (
                    <li className={classes.blogCategory} key={postCategory.category.id}>
                      {postCategory.category.name}
                    </li>
                  ))
                }
              </ul>
            </div>
            <p className={classes.blogTitle}>{post.title}</p>
            <p className={classes.blogExcerpt}>{parse(post.content)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
