"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import classes from "./page.module.css";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import type { Post } from "../../_types/Post";
import { useApiSWR } from "@/app/_hooks/useApiSWR";

export default function Detail() {
  const { id } = useParams();

  const { data, error, isLoading } = useApiSWR<{ post: Post }>(
    id ? `/api/posts/${id}` : null
  );

  const post = data?.post ?? null;
  if (error) return <div>エラーが発生しました</div>;

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
