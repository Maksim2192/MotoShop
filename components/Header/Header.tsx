"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import styles from "./Header.module.css";

interface CartItem {
  id: number;
  quantity: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: "USER" | "ADMIN";
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const profileRef =
    useRef<HTMLDivElement>(null);

  const [cartCount, setCartCount] =
    useState(0);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [user, setUser] =
    useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const isActive = (
    path: string
  ) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  const updateCartCount = () => {
    try {
      const cart: CartItem[] =
        JSON.parse(
          localStorage.getItem(
            "cart"
          ) || "[]"
        );

      const totalCount =
        cart.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        );

      setCartCount(totalCount);
    } catch {
      setCartCount(0);
    }
  };

  const loadUser =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/auth/me",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const text =
          await response.text();

        if (!text) {
          setUser(null);
          return;
        }

        const result =
          JSON.parse(text);

        setUser(
          result.data ??
            result.user ??
            null
        );
      } catch (error) {
        console.error(
          "LOAD USER ERROR:",
          error
        );

        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }, []);

  useEffect(() => {
    updateCartCount();
    loadUser();

    const handleAuthUpdate =
      () => {
        setAuthLoading(true);
        loadUser();
      };

    window.addEventListener(
      "cart-updated",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );

    window.addEventListener(
      "auth-updated",
      handleAuthUpdate
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );

      window.removeEventListener(
        "auth-updated",
        handleAuthUpdate
      );
    };
  }, [loadUser]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value =
      search.trim();

    if (!value) {
      return;
    }

    router.push(
      `/products?search=${encodeURIComponent(
        value
      )}`
    );

    setSearchOpen(false);
    setSearch("");
  };

  const handleSearchToggle =
    () => {
      setSearchOpen(
        (current) => !current
      );

      setProfileOpen(false);

      if (searchOpen) {
        setSearch("");
      }
    };

  const handleLogout =
    async () => {
      try {
        const response =
          await fetch(
            "/api/auth/logout",
            {
              method: "POST",
            }
          );

        if (!response.ok) {
          const text =
            await response.text();

          let message =
            "Не вдалося вийти";

          try {
            const result =
              text
                ? JSON.parse(text)
                : {};

            message =
              result.message ||
              message;
          } catch {
            // ignore
          }

          throw new Error(
            message
          );
        }

        setUser(null);
        setProfileOpen(false);

        window.dispatchEvent(
          new Event(
            "auth-updated"
          )
        );

        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(
          "LOGOUT ERROR:",
          error
        );
      }
    };

  return (
    <header
      className={styles.header}
    >
      <div
        className={
          styles.container
        }
      >
        <Link
          href="/"
          className={styles.logo}
        >
          MOTO<span>SHOP</span>
        </Link>

        <nav
          className={styles.nav}
        >
          <Link
            href="/"
            className={`${
              styles.navLink
            } ${
              isActive("/")
                ? styles.active
                : ""
            }`}
          >
            Головна
          </Link>

          <Link
            href="/products"
            className={`${
              styles.navLink
            } ${
              isActive(
                "/products"
              )
                ? styles.active
                : ""
            }`}
          >
            Каталог
          </Link>

          <Link
            href="/sales"
            className={`${
              styles.navLink
            } ${
              isActive("/sales")
                ? styles.active
                : ""
            }`}
          >
            Акції
          </Link>

          <Link
            href="/about"
            className={`${
              styles.navLink
            } ${
              isActive("/about")
                ? styles.active
                : ""
            }`}
          >
            Про нас
          </Link>
        </nav>

        <div
          className={styles.actions}
        >
          {/* PROFILE */}

          {!authLoading &&
            (!user ? (
              <Link
                href="/login"
                className={
                  styles.iconButton
                }
                aria-label="Увійти в акаунт"
                title="Увійти"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M4 21C4 17.6863 7.58172 15 12 15C16.4183 15 20 17.6863 20 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            ) : (
              <div
                ref={profileRef}
                className={
                  styles.profile
                }
              >
                <button
                  type="button"
                  className={
                    styles.profileButton
                  }
                  aria-expanded={
                    profileOpen
                  }
                  aria-label="Меню профілю"
                  onClick={() => {
                    setProfileOpen(
                      (current) =>
                        !current
                    );

                    setSearchOpen(
                      false
                    );
                  }}
                >
                  <span
                    className={
                      styles.avatar
                    }
                  >
                    {user.name
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span
                    className={
                      styles.userName
                    }
                  >
                    {user.name}
                  </span>

                  <svg
                    className={`${
                      styles.chevron
                    } ${
                      profileOpen
                        ? styles.chevronOpen
                        : ""
                    }`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {profileOpen && (
                  <div
                    className={
                      styles.profileMenu
                    }
                  >
                    <div
                      className={
                        styles.profileInfo
                      }
                    >
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>

                    <div
                      className={
                        styles.profileDivider
                      }
                    />

                    <Link
                      href="/profile"
                      onClick={() =>
                        setProfileOpen(
                          false
                        )
                      }
                    >
                      <span>
                        Мій профіль
                      </span>

                      <span>→</span>
                    </Link>

                    <Link
                      href="/profile/orders"
                      onClick={() =>
                        setProfileOpen(
                          false
                        )
                      }
                    >
                      <span>
                        Мої замовлення
                      </span>

                      <span>→</span>
                    </Link>

                    {user.role ===
                      "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() =>
                          setProfileOpen(
                            false
                          )
                        }
                      >
                        <span>
                          Адмін-панель
                        </span>

                        <span>→</span>
                      </Link>
                    )}

                    <div
                      className={
                        styles.profileDivider
                      }
                    />

                    <button
                      type="button"
                      className={
                        styles.logoutButton
                      }
                      onClick={
                        handleLogout
                      }
                    >
                      <span>
                        Вийти
                      </span>

                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

          {/* SEARCH */}

          <button
            type="button"
            className={
              styles.iconButton
            }
            aria-label="Пошук"
            onClick={
              handleSearchToggle
            }
          >
            {searchOpen ? (
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M16.5 16.5L21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* CART */}

          <Link
            href="/cart"
            className={
              styles.cartButton
            }
            aria-label="Кошик"
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 4H5L7.4 15.2C7.6 16.2 8.5 17 9.6 17H18C19 17 19.9 16.3 20.1 15.3L21.5 8H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="10"
                cy="21"
                r="1"
                fill="currentColor"
              />

              <circle
                cx="18"
                cy="21"
                r="1"
                fill="currentColor"
              />
            </svg>

            {cartCount > 0 && (
              <span
                className={
                  styles.cartCount
                }
              >
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* SEARCH PANEL */}

      {searchOpen && (
        <div
          className={
            styles.searchWrapper
          }
        >
          <form
            className={
              styles.searchForm
            }
            onSubmit={
              handleSearch
            }
          >
            <svg
              className={
                styles.searchIcon
              }
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="search"
              placeholder="Пошук товарів..."
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              autoFocus
            />

            <button
              type="submit"
              disabled={
                !search.trim()
              }
            >
              Знайти
            </button>
          </form>
        </div>
      )}
    </header>
  );
}