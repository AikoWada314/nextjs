"use client"


import React, { ReactNode, useState } from "react";
import type { ApiType } from '../_types/Types';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [errors, setErrors] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleForm = (elem: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [elem.target.name]: elem.target.value
    });
  };


  const valid = () => {
    let isValid = true;
    let nameError = "";
    let emailError = "";
    let contentError = "";

    if (!form.name) {
      nameError = "名前を入力してください";
      isValid = false;
    }
    if (form.name.length > 30) {
      nameError = "名前は30文字以内で入力してください";
      isValid = false;
    }
    if (!form.email) {
      emailError = "メールアドレスを入力してください";
      isValid = false;
    }
    if (!form.email.match(/.+@.+\..+/)) {
      emailError = "正しいメールアドレスを入力してください";
      isValid = false;
    }
    if (!form.content) {
      contentError = "内容を入力してください";
      isValid = false;
    }
    if (form.content.length > 500) {
      contentError = "内容は500文字以内で入力してください";
      isValid = false;
    }

    setErrors({
      name: nameError,
      email: emailError,
      content: contentError
    });

    return isValid;
  };

  const handleClear = () => {
    setForm({
      name: '',
      email: '',
      content: ''
    });
    setErrors({
      name: '',
      email: '',
      content: ''
    });
  };

  const handleSubmit = async (elem:React.FormEvent<HTMLFormElement>) => {
    elem.preventDefault();

    if (!valid()) return;

    setSubmitting(true);
    try {

      const apiOptions: ApiType = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.content }),
      };

      await fetch('https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.content }),
      });

      alert('送信しました。');
      handleClear();
    } catch (error) {
      alert('送信に失敗しました。');
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="max-w-[800px] mx-auto py-10">
        <h1 className="text-xl font-bold mb-10">問い合わせフォーム</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <label htmlFor="name" className="w-[240px]">お名前</label>
            <div className="flex-1">
              <input id="name" type="text" name="name" value={form.name} onChange={handleForm} disabled={submitting} className="border border-gray-300 rounded-lg p-4 w-full"/>
              <span className="text-red-500 block">{errors.name}</span>
            </div>
          </div>
          <div className="flex mt-4">
            <label htmlFor="email" className="w-[240px]">メールアドレス</label>
            <div className="flex-1">
              <input id="email" type="text" name="email" value={form.email} onChange={handleForm} disabled={submitting}  className="border border-gray-300 rounded-lg p-4 w-full"/>
              <span className="text-red-500 block">{errors.email}</span>
            </div>
          </div>
          <div className="flex mt-4">
            <label htmlFor="content" className="w-[240px]">本文</label>
            <div className="flex-1">
              <textarea id="content" name="content" cols={30} rows={5} value={form.content} onChange={handleForm} disabled={submitting}  className="border border-gray-300 rounded-lg p-4 w-full"></textarea>
              <span className="text-red-500 block">{errors.content}</span>
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