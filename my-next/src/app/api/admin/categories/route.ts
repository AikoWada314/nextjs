import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";
import { NextRequest } from "next/server";

// カテゴリー一覧APIのレスポンスの型
export type CategoriesIndexResponse = {
  status: string;
  categories: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 }); // tokenが正しい場合、以降が実行される

  try {
    // カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc", // 作成日時の降順で取得
      },
    });

    // レスポンスを返す
    return NextResponse.json<CategoriesIndexResponse>({ status: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// カテゴリーの作成時に送られてくるリクエストのbodyの型
export type CreateCategoryRequestBody = {
  name: string;
}

export const POST = async (request: Request) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json();

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body;

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
