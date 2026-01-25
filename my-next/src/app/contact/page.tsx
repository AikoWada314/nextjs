"use client"

import React, { useState } from "react";
import { useForm } from 'react-hook-form'

type FormValues = {
  name: string;
  email: string;
  content: string;
}

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      content: ''
    }
  });

  const handleClear = () => {
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await fetch('https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.content }),
      });

      alert('送信しました。');
      handleClear();
    } catch {
      alert('送信に失敗しました。');
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="max-w-[800px] mx-auto py-10">
        <h1 className="text-xl font-bold mb-10">問い合わせフォーム</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <label htmlFor="name" className="w-[240px]">お名前</label>
            <div className="flex-1">
              <input 
                id="name" 
                type="text" 
                {...register("name", { 
                  required: "名前を入力してください",
                  maxLength: {
                    value: 30,
                    message: "名前は30文字以内で入力してください"
                  }
                })} 
                disabled={submitting} 
                className="border border-gray-300 rounded-lg p-4 w-full"
              />
              {errors.name && (
                <span className="text-red-500 block">{errors.name.message}</span>
              )}
            </div>
          </div>
          <div className="flex mt-4">
            <label htmlFor="email" className="w-[240px]">メールアドレス</label>
            <div className="flex-1">
              <input 
                id="email" 
                type="email" 
                {...register("email", { 
                  required: "メールアドレスを入力してください",
                  pattern: {
                    value: /.+@.+\..+/,
                    message: "正しいメールアドレスを入力してください"
                  }
                })} 
                disabled={submitting}  
                className="border border-gray-300 rounded-lg p-4 w-full"
              />
              {errors.email && (
                <span className="text-red-500 block">{errors.email.message}</span>
              )}
            </div>
          </div>
          <div className="flex mt-4">
            <label htmlFor="content" className="w-[240px]">本文</label>
            <div className="flex-1">
              <textarea 
                id="content" 
                cols={30} 
                rows={5} 
                {...register("content", { 
                  required: "内容を入力してください",
                  maxLength: {
                    value: 500,
                    message: "内容は500文字以内で入力してください"
                  }
                })} 
                disabled={submitting}  
                className="border border-gray-300 rounded-lg p-4 w-full"
              ></textarea>
              {errors.content && (
                <span className="text-red-500 block">{errors.content.message}</span>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <button type="submit" disabled={submitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">送信</button>
            <button type="button" onClick={handleClear} disabled={submitting} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">クリア</button>
          </div>
        </form>
      </div>
    </>
  );
}