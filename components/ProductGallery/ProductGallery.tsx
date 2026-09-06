"use client";

import { useEffect, useState } from "react";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
  images: string[];
  name: string;
  discount?: number;
}

export default function ProductGallery({
  images,
  name,
  discount = 0,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isOpen, setIsOpen] =
    useState(false);

  const safeImages =
    images?.filter(Boolean) ?? [];

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? safeImages.length - 1
        : current - 1
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === safeImages.length - 1
        ? 0
        : current + 1
    );
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (
        event.key === "ArrowLeft" &&
        safeImages.length > 1
      ) {
        showPrevious();
      }

      if (
        event.key === "ArrowRight" &&
        safeImages.length > 1
      ) {
        showNext();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className={styles.gallery}>
        <div
          className={styles.mainWrapper}
        >
          <div className={styles.noImage}>
            Немає фото
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.gallery}>
        <button
          type="button"
          className={
            styles.mainImageButton
          }
          onClick={() =>
            setIsOpen(true)
          }
          aria-label="Відкрити фото"
        >
          <div
            className={
              styles.mainWrapper
            }
          >
            <img
              src={
                safeImages[
                  activeIndex
                ]
              }
              alt={name}
              className={
                styles.mainImage
              }
            />

            <span
              className={
                styles.zoomHint
              }
            >
              ⛶
            </span>

            {discount > 0 && (
              <span
                className={
                  styles.discount
                }
              >
                -{discount}%
              </span>
            )}
          </div>
        </button>

        {safeImages.length > 1 && (
          <div
            className={
              styles.thumbnails
            }
          >
            {safeImages.map(
              (image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`${styles.thumbnail} ${
                    activeIndex ===
                    index
                      ? styles.active
                      : ""
                  }`}
                  onClick={() =>
                    setActiveIndex(
                      index
                    )
                  }
                >
                  <img
                    src={image}
                    alt={`${name} фото ${
                      index + 1
                    }`}
                  />
                </button>
              )
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className={styles.lightbox}
          onClick={() =>
            setIsOpen(false)
          }
        >
          <button
            type="button"
            className={
              styles.closeButton
            }
            onClick={() =>
              setIsOpen(false)
            }
            aria-label="Закрити"
          >
            ×
          </button>

          {safeImages.length > 1 && (
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.leftArrow}`}
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
            >
              ‹
            </button>
          )}

          <div
            className={
              styles.lightboxContent
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={
                safeImages[
                  activeIndex
                ]
              }
              alt={name}
              className={
                styles.lightboxImage
              }
            />

            <span
              className={
                styles.imageCounter
              }
            >
              {activeIndex + 1} /{" "}
              {safeImages.length}
            </span>
          </div>

          {safeImages.length > 1 && (
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.rightArrow}`}
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}