"use client";

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

  const handleDelete = async () => {
    const isConfirmed = confirm(
      "Ви точно хочете видалити цей товар?"
    );

    if (!isConfirmed) return;

    const response = await fetch(
      `/api/admin/products/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("Не вдалося видалити товар");
      return;
    }

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={className}
    >
      Видалити
    </button>
  );
}