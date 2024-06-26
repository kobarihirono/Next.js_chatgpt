"use client";
// クライアントサイドレンダリングのみ有効

import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Inputs = { email: string; password: string };

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCrendential) => {
        const user = userCrendential.user;
        router.push("/auth/login");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("このメールアドレスは既に使用されています");
        } else {
          alert("エラーが発生しました");
        }
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="bg-white p-8 rounded-lg w-96"
      >
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">新規登録</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                message: "メールアドレスの形式が正しくありません",
              },
            })}
            type="email"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            {...register("password", {
              required: "パスワードは必須です",
              minLength: {
                value: 6,
                message: "パスワードは6文字以上で入力してください",
              },
            })}
            type="password"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
          >
            新規登録
          </button>
        </div>
        <div className="mt-4">
          <span className="text-gray-600 text-sm">
            既にアカウントをお持ちですか？
          </span>
          <Link
            href={"/auth/login"}
            className="text-blue-500 text-sm hover:text-blue-700"
          >
            ログインページへ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
