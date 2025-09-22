"use client"

import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import classes from "./page.module.css";
import type { Post } from './_types/Types';


export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts")
      const data = await res.json()
      setPosts(data.posts)
      setIsLoading(false);
    }

    fetcher()
  }, [])

    const [isLoading, setIsLoading] = useState(true);
    if (isLoading) return <div>読み込み中</div>;

  return (
    <ul className={classes.blogList}>
      {posts.map((post) => (
        <li key={post.id} className={classes.blogItem}>
          <Link href={`/posts/${post.id}`} className={classes.blogLink}>
            <div className={classes.blogMeta}>
              <p className={classes.blogDate}>{new Date(post.createdAt).toLocaleDateString()}</p>
              <ul className={classes.blogCategories}>
                {post.categories.map((cat: string) => (
                  <li className={classes.blogCategory} key={cat}>{cat}</li>
                ))}
              </ul>
            </div>
            <p className={classes.blogTitle}>{post.title}</p>
            <p className={classes.blogExcerpt}>{parse(post.content)}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
