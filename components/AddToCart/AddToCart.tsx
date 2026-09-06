"use client";

import { useState } from "react";
import styles from "./AddToCart.module.css";

interface AddToCartProps {
  productId: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function AddToCart({
  productId,
  name,
  price,
  image,
  stock,
}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    setQuantity((prev) =>
      Math.min(stock, prev + 1)
    );
  };

  const handleAddToCart = () => {
    const currentCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingProduct =
      currentCart.find(
        (item: { id: number }) =>
          item.id === productId
      );

    let updatedCart;

    if (existingProduct) {
      updatedCart = currentCart.map(
        (item: {
          id: number;
          quantity: number;
        }) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  stock,
                  item.quantity + quantity
                ),
              }
            : item
      );
    } else {
      updatedCart = [
        ...currentCart,
        {
          id: productId,
          name,
          price,
          image,
          quantity,
          stock,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );
  };

  return (
    <div className={styles.buyBlock}>
      <div className={styles.quantity}>
        <button
          type="button"
          onClick={decrease}
          disabled={quantity <= 1}
        >
          −
        </button>

        <span>{quantity}</span>

        <button
          type="button"
          onClick={increase}
          disabled={quantity >= stock}
        >
          +
        </button>
      </div>

      <button
        type="button"
        className={styles.cartButton}
        onClick={handleAddToCart}
        disabled={stock <= 0}
      >
        {stock > 0
          ? "Додати в кошик"
          : "Немає в наявності"}
      </button>
    </div>
  );
}