"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token) {
      setError("Токен відновлення відсутній");
      return;
    }

    if (password.length < 8) {
      setError("Пароль повинен містити мінімум 8 символів");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Не вдалося змінити пароль"
        );
      }

      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Сталася помилка"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Новий пароль</h1>

        <input
          type="password"
          placeholder="Новий пароль"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Повторіть пароль"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Збереження..."
            : "Змінити пароль"}
        </button>
      </form>
    </main>
  );
}