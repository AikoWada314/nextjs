"use client"

import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import classes from "./page.module.css";
import type { MicroCmsPost } from './_types/Types';

export default function BlogList() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      const res = await fetch('https://chapter9.microcms.io/api/v1/posts', {
        headers: {
          'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      const { contents } = await res.json();
      setPosts(contents);
      setIsLoading(false);
    };

    fetcher();
  }, []);

  if (isLoading) return <div>読み込み中</div>;

  return (
    <ul className={classes.blogList}>
      {posts.map((post) => (
        <li key={post.id} className={classes.blogItem}>
          <Link href={`/posts/${post.id}`} className={classes.blogLink}>
            <div className={classes.blogMeta}>
              <p className={classes.blogDate}>{new Date(post.createdAt).toLocaleDateString()}</p>
              <ul className={classes.blogCategories}>
                {post.categories.map((cat) => (
                  <li className={classes.blogCategory} key={cat.id}>{cat.name}</li>
                ))}
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
