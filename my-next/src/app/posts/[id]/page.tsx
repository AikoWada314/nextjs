"use client"

import React from 'react';
import { useParams } from "next/navigation";
import classes from './page.module.css';
import parse from 'html-react-parser';
import { useEffect, useState } from "react";
import type { Post } from '../../_types/Types';



export default function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
      const { post } = await res.json();
      setPost(post);
      setIsLoading(false);
    };
    fetcher();
  }, [id]);

  if (isLoading) return <div>読み込み中</div>;
  if (!post) return <div>記事が見つかりません</div>;

  return (
    <div className={classes.detailBody}>
      <div className={classes.detailThumbnail}>
        <img src={post.thumbnailUrl} alt={post.title} />
      </div>
      <div className={classes.detailContent}>
        <div className={classes.detailMeta}>
          <p className={classes.detailDate}>{new Date(post.createdAt).toLocaleDateString()}</p>
          <ul className={classes.detailCategories}>
            {post.categories.map((cat) => (
              <li className={classes.detailCategory} key={cat}>{cat}</li>
            ))}
          </ul>
        </div>
        <h1 className={classes.detailTitle}>{post.title}</h1>
          <div className={classes.detailExcerpt}>{parse(post.content)}</div>
      </div>
    </div>
  );
}