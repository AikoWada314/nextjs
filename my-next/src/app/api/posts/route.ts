import {NextResponse} from 'next/server'
import {PrismaClient} from '@prisma/client'
import { supabase } from '@/app/utils/supabase'

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async () => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include:{
        // カテゴリーも含めて取得
        postCategories:{
          include:{
            category:{
              // カテゴリーのidとnameだけ取得
              select:{
                id:true,
                name:true,
              },
            },
          },
        },
      },
      // 作成日時の降順で取得
      orderBy:{
        createdAt:'desc',
      },
    })
    
    // 各記事のthumbnailImageKeyから公開URLを生成
    const postsWithThumbnailUrl = posts.map(post => {
      let thumbnailUrl = '';
      if (post.thumbnailImageKey) {
        const { data: urlData } = supabase.storage
          .from('post_thumbnail')
          .getPublicUrl(post.thumbnailImageKey)
        thumbnailUrl = urlData.publicUrl
      }
      return {
        ...post,
        thumbnailUrl,
      }
    })
    
    // レスポンスを返す
    return NextResponse.json({status:'OK',posts:postsWithThumbnailUrl},
      {status:200})
  }
  catch(error){
    if (error instanceof Error)
      return NextResponse.json({status:error.message},{status:400})
  }
}