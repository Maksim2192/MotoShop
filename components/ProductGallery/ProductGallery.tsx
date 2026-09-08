"use client";

import {
  useEffect,
  useState,
} from "react";

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

  const [touchStart, setTouchStart] =
    useState<number | null>(null);

  const safeImages = images?.filter(Boolean) ?? [];

  const hasMultipleImages =
    safeImages.length > 1;

  useEffect(() => {
    if (
      activeIndex >= safeImages.length
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, safeImages.length]);

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
        hasMultipleImages
      ) {
        setActiveIndex((current) =>
          current === 0
            ? safeImages.length - 1
            : current - 1
        );
      }

      if (
        event.key === "ArrowRight" &&
        hasMultipleImages
      ) {
        setActiveIndex((current) =>
          current === safeImages.length - 1
            ? 0
            : current + 1
        );
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isOpen,
    hasMultipleImages,
    safeImages.length,
  ]);

  const showPrevious = () => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveIndex((current) =>
      current === 0
        ? safeImages.length - 1
        : current - 1
    );
  };

  const showNext = () => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveIndex((current) =>
      current === safeImages.length - 1
        ? 0
        : current + 1
    );
  };

  const handleTouchStart = (
    event: React.TouchEvent
  ) => {
    setTouchStart(
      event.touches[0].clientX
    );
  };

  const handleTouchEnd = (
    event: React.TouchEvent
  ) => {
    if (touchStart === null) {
      return;
    }

    const touchEnd =
      event.changedTouches[0].clientX;

    const distance =
      touchStart - touchEnd;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        showNext();
      } else {
        showPrevious();
      }
    }

    setTouchStart(null);
  };

  if (safeImages.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.mainWrapper}>
          <div className={styles.noImage}>
            Немає фото
          </div>
        </div>
      </div>
    );
  }

  const currentImage =
    safeImages[activeIndex];

  return (
    <>
      <div className={styles.gallery}>
        <div
          className={styles.mainWrapper}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className={styles.mainImageButton}
            onClick={() => setIsOpen(true)}
            aria-label={`Відкрити фото ${activeIndex + 1} з ${safeImages.length}`}
          >
            <img
              src={currentImage}
              alt={`${name} — фото ${
                activeIndex + 1
              }`}
              className={styles.mainImage}
            />

            <span
              className={styles.zoomHint}
              aria-hidden="true"
            >
              ⛶
            </span>

            {discount > 0 && (
              <span className={styles.discount}>
                -{discount}%
              </span>
            )}
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                className={`${styles.mainArrow} ${styles.mainArrowLeft}`}
                onClick={showPrevious}
                aria-label="Попереднє фото"
              >
                ‹
              </button>

              <button
                type="button"
                className={`${styles.mainArrow} ${styles.mainArrowRight}`}
                onClick={showNext}
                aria-label="Наступне фото"
              >
                ›
              </button>
            </>
          )}

          {hasMultipleImages && (
            <span
              className={styles.mainCounter}
            >
              {activeIndex + 1} /{" "}
              {safeImages.length}
            </span>
          )}
        </div>

        {hasMultipleImages && (
          <div
            className={styles.thumbnails}
            role="tablist"
            aria-label="Фотографії товару"
          >
            {safeImages.map(
              (image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={
                    activeIndex === index
                  }
                  aria-label={`Вибрати фото ${
                    index + 1
                  }`}
                  className={`${styles.thumbnail} ${
                    activeIndex === index
                      ? styles.active
                      : ""
                  }`}
                  onClick={() =>
                    setActiveIndex(index)
                  }
                >
                  <img
                    src={image}
                    alt={`${name} — мініатюра ${
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
          role="dialog"
          aria-modal="true"
          aria-label="Перегляд фотографій"
          onClick={() =>
            setIsOpen(false)
          }
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={() =>
              setIsOpen(false)
            }
            aria-label="Закрити перегляд"
          >
            ×
          </button>

          {hasMultipleImages && (
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.leftArrow}`}
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Попереднє фото"
            >
              ‹
            </button>
          )}

          <div
            className={styles.lightboxContent}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={currentImage}
              alt={`${name} — фото ${
                activeIndex + 1
              }`}
              className={styles.lightboxImage}
            />

            {hasMultipleImages && (
              <span
                className={styles.imageCounter}
              >
                {activeIndex + 1} /{" "}
                {safeImages.length}
              </span>
            )}
          </div>

          {hasMultipleImages && (
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.rightArrow}`}
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Наступне фото"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}