import {NextRequest, NextResponse} from 'next/server'
import {PrismaClient} from '@prisma/client'
import { supabase } from '@/app/utils/supabase'

const prisma = new PrismaClient()

export type PostShowResponse = {
  status: string
  post: {
    id: number
    title: string
    content: string
    thumbnailImageKey: string
    thumbnailUrl: string
    createdAt: Date
    updatedAt: Date
    postCategories: {
      category: {
        id: number
        name: string
      }
    }[]
  } | null
}

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request:NextRequest,
  {params}:{params:{id:string}},// ここでリクエストパラメータを受け取る
) => {
    // paramsの中にidが入っているので、それを取り出す
    const {id} =params

    try {
    console.log('🔍 API: 記事取得開始 - ID:', id, '型:', typeof id);
    const postId = parseInt(id);
    console.log('🔢 変換後のID:', postId);
    
    // idを元にPostをDBから取得
    const post = await prisma.post.findUnique({
      where:{
        id: postId,
      },
      // カテゴリーも含めて取得
      include:{
        postCategories:{
          include:{
            category:{
              select:{
                // カテゴリーのidとnameだけ取得
                id:true,
                name:true,
              },
            },
          },
        },
      },
    })
    
    
    // thumbnailImageKeyから公開URLを生成
    let thumbnailUrl = '';
    if (post?.thumbnailImageKey) {
      const { data: urlData } = supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(post.thumbnailImageKey)
      thumbnailUrl = urlData.publicUrl
    }
    
    // thumbnailUrlを含めてレスポンスを返す
    const postWithThumbnailUrl = post ? {
      ...post,
      thumbnailUrl,
    } : null
    
    return NextResponse.json<PostShowResponse>({status:'OK',post:postWithThumbnailUrl},{status:200})
  } catch(error){
    if (error instanceof Error)
      return NextResponse.json({status:error.message},{status:400})
  }
}