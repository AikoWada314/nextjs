"use client"

import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import classes from "./page.module.css";
import type { Post } from './_types/Post';

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/posts");
        
        if (!res.ok) {
          throw new Error('投稿の取得に失敗しました');
        }
        
        const data = await res.json();        
        setPosts(data.posts || []);
        
      } catch (error) {
        console.error('エラー:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, []);

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
