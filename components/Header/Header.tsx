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

const navigation = [
  {
    label: "Головна",
    href: "/",
  },
  {
    label: "Каталог",
    href: "/products",
  },
  {
    label: "Акції",
    href: "/sales",
  },
  {
    label: "Про нас",
    href: "/about",
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef =
    useRef<HTMLInputElement>(null);

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

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }

      return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
      );
    },
    [pathname]
  );

  const updateCartCount = useCallback(() => {
    try {
      const storedCart =
        localStorage.getItem("cart");

      if (!storedCart) {
        setCartCount(0);
        return;
      }

      const cart: CartItem[] =
        JSON.parse(storedCart);

      const total = cart.reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 0),
        0
      );

      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  const loadUser = useCallback(
    async () => {
      try {
        const response = await fetch(
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

        const currentUser =
          result.data ??
          result.user ??
          null;

        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    updateCartCount();
    loadUser();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleAuthUpdate = () => {
      setAuthLoading(true);
      loadUser();
    };

    window.addEventListener(
      "cart-updated",
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleCartUpdate
    );

    window.addEventListener(
      "auth-updated",
      handleAuthUpdate
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleCartUpdate
      );

      window.removeEventListener(
        "auth-updated",
        handleAuthUpdate
      );
    };
  }, [
    loadUser,
    updateCartCount,
  ]);

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
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key !== "Escape") {
        return;
      }

      setProfileOpen(false);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  useEffect(() => {
    setProfileOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);


  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value =
      search.trim();

    if (!value) {
      searchInputRef.current?.focus();
      return;
    }

    setSearchOpen(false);
    setSearch("");
    setMobileMenuOpen(false);

    router.push(
      `/products?search=${encodeURIComponent(
        value
      )}`
    );
  };

  const toggleSearch = () => {
    setSearchOpen(
      (current) => !current
    );

    setProfileOpen(false);
    setMobileMenuOpen(false);

    if (searchOpen) {
      setSearch("");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(
      (current) => !current
    );

    setSearchOpen(false);
    setProfileOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }

    setLogoutLoading(true);

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Не вдалося вийти з акаунта"
        );
      }

      setUser(null);
      setProfileOpen(false);
      setMobileMenuOpen(false);

      window.dispatchEvent(
        new Event("auth-updated")
      );

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );
    } finally {
      setLogoutLoading(false);
    }
  };


  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link
          href="/"
          className={styles.logo}
          aria-label="MotoShop — головна"
        >
          MOTO<span>SHOP</span>
        </Link>


        <nav
          className={styles.nav}
          aria-label="Головна навігація"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href)
                  ? styles.active
                  : ""
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>


        <div className={styles.actions}>

          {!authLoading &&
            (user ? (
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
                  aria-label="Меню профілю"
                  aria-expanded={
                    profileOpen
                  }
                  onClick={() => {
                    setProfileOpen(
                      (current) =>
                        !current
                    );
                    setSearchOpen(false);
                    setMobileMenuOpen(false);
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
                    className={`${styles.chevron} ${profileOpen
                        ? styles.chevronOpen
                        : ""
                      }`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
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
                        setProfileOpen(false)
                      }
                    >
                      <span>
                        Мій профіль
                      </span>

                      <span aria-hidden="true">
                        →
                      </span>
                    </Link>

                    <Link
                      href="/profile/orders"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >
                      <span>
                        Мої замовлення
                      </span>

                      <span aria-hidden="true">
                        →
                      </span>
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

                          <span aria-hidden="true">
                            →
                          </span>
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
                      disabled={
                        logoutLoading
                      }
                      onClick={
                        handleLogout
                      }
                    >
                      <span>
                        {logoutLoading
                          ? "Вихід..."
                          : "Вийти"}
                      </span>

                      <span aria-hidden="true">
                        →
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={
                  styles.iconButton
                }
                aria-label="Увійти в акаунт"
                title="Увійти"
              >
                <UserIcon />
              </Link>
            ))}

          <button
            type="button"
            className={
              styles.iconButton
            }
            aria-label={
              searchOpen
                ? "Закрити пошук"
                : "Відкрити пошук"
            }
            aria-expanded={
              searchOpen
            }
            onClick={
              toggleSearch
            }
          >
            {searchOpen ? (
              <CloseIcon />
            ) : (
              <SearchIcon />
            )}
          </button>

          <Link
            href="/cart"
            className={
              styles.cartButton
            }
            aria-label={`Кошик${cartCount
                ? `, ${cartCount} товарів`
                : ""
              }`}
          >
            <CartIcon />

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

          <button
            type="button"
            className={
              styles.menuButton
            }
            aria-label={
              mobileMenuOpen
                ? "Закрити меню"
                : "Відкрити меню"
            }
            aria-expanded={
              mobileMenuOpen
            }
            onClick={
              toggleMobileMenu
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

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
            onSubmit={handleSearch}
          >
            <SearchIcon
              className={
                styles.searchIcon
              }
            />

            <input
              ref={searchInputRef}
              type="search"
              placeholder="Пошук товарів..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              autoFocus
              aria-label="Пошук товарів"
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

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className={
              styles.mobileOverlay
            }
            aria-label="Закрити меню"
            onClick={
              closeMobileMenu
            }
          />

          <nav
            className={
              styles.mobileMenu
            }
            aria-label="Мобільна навігація"
          >
            {navigation.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive(
                      item.href
                    )
                      ? styles.mobileActive
                      : ""
                  }
                  onClick={
                    closeMobileMenu
                  }
                >
                  {item.label}
                </Link>
              )
            )}

            <div
              className={
                styles.mobileDivider
              }
            />

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={
                    closeMobileMenu
                  }
                >
                  Мій профіль
                </Link>

                <Link
                  href="/profile/orders"
                  onClick={
                    closeMobileMenu
                  }
                >
                  Мої замовлення
                </Link>

                {user.role ===
                  "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={
                        closeMobileMenu
                      }
                    >
                      Адмін-панель
                    </Link>
                  )}

                <button
                  type="button"
                  className={
                    styles.mobileLogout
                  }
                  disabled={
                    logoutLoading
                  }
                  onClick={
                    handleLogout
                  }
                >
                  {logoutLoading
                    ? "Вихід..."
                    : "Вийти з акаунта"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={
                  styles.mobileLogin
                }
                onClick={
                  closeMobileMenu
                }
              >
                Увійти в акаунт
              </Link>
            )}
          </nav>
        </>
      )}
    </header>
  );
}

interface IconProps {
  className?: string;
}

function UserIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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
  );
}

function SearchIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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
  );
}

function CloseIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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
  );
}

function CartIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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
  );
}