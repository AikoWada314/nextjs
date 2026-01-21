"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import classes from "./page.module.css";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import type { Post } from "../../_types/Post";

export default function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error("投稿の取得に失敗しました");
        }

        const data = await res.json();

        // APIは {status:'OK', post: {...}} の形式で返す
        if (data.post) {
          setPost(data.post);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("エラー:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetcher();
  }, [id]);

  if (isLoading) return <div>読み込み中</div>;
  if (!post) return <div>記事が見つかりません</div>;

  return (
    <div className={classes.detailBody}>
      <div className={classes.detailThumbnail}>
        <Image
          src={post.thumbnailUrl || "/placeholder.jpg"}
          alt={post.title}
          width={800}
          height={400}
        />
      </div>
      <div className={classes.detailContent}>
        <div className={classes.detailMeta}>
          <p className={classes.detailDate}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <ul className={classes.detailCategories}>
            {post.postCategories?.map((postCategory) => (
              <li
                className={classes.detailCategory}
                key={postCategory.category.id}
              >
                {postCategory.category.name}
              </li>
            ))}
          </ul>
        </div>
        <h1 className={classes.detailTitle}>{post.title}</h1>
        <div className={classes.detailExcerpt}>{parse(post.content)}</div>
      </div>
    </div>
  );
}
