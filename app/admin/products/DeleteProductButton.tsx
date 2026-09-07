"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  id: number;
  className?: string;
}

export default function DeleteProductButton({
  id,
  className,
}: DeleteProductButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] =
    useState(false);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Ви точно хочете видалити цей товар?"
    );

    if (!isConfirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Не вдалося видалити товар"
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Не вдалося видалити товар"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={className}
      disabled={deleting}
    >
      {deleting
        ? "Видалення..."
        : "Видалити"}
    </button>
  );
}