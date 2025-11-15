import { getAllCategoriesFromDB } from "@/app/actions/categories";
import { TResponseUser } from "@/types";
import { getUserFromCookies } from "@/utils/getUserFromCookies";
import { decodedToken } from "@/utils/jwt";
import Link from "next/link";
import ActiveLink from "../ActiveLink";
import Container from "../Container";
import MobileNavSheet from "./MobileNavSheet";
import { navItems } from "./navbar.utils";
import SearchInput from "./SearchInput";
import CartSheet from "./Sheets/CartSheet";
import WishlistSheet from "./Sheets/WishlistSheet";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const categoriesResponse = await getAllCategoriesFromDB();

  const token = await getUserFromCookies();

  let user;

  if (token) {
    user = decodedToken(token as string);
  }

  const isAdmin = user?.role === "admin";
  // const isUser = user?.role === "user";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-deep-dark">
      <Container className="">
        <div className="flex h-12 md:h-16 2xl:h-[70px] items-center justify-between">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Drawer (client) */}
            <div className="block lg:hidden">
              <MobileNavSheet
                user={user as TResponseUser | null}
                categories={categoriesResponse?.data}
              />
            </div>

            <Link href="/">
              <span className="font-bold text-xl 2xl:text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent uppercase">
                Gadgetoria
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {navItems.map((item, index) => (
              <ActiveLink
                href={item.href}
                key={index}
                exact={item.href === "/"}
              >
                <span className="lg:text-[17px] 2xl:text-lg transition-colors duration-300 hover:text-primary">
                  {item.name}
                </span>
              </ActiveLink>
            ))}

            {user && (
              <>
                {isAdmin && (
                  <ActiveLink href="/dashboard/admin">
                    <span className="lg:text-[17px] transition-colors duration-300 hover:text-primary">
                      Dashboard
                    </span>
                  </ActiveLink>
                )}
              </>
            )}
          </div>

          {/* Right: Theme Toggle + Auth */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:block">
              <SearchInput />
            </div>

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-3">
              {/* <Heart className="w-5 h-5" />
              <ShoppingCart className="w-5 h-5" /> */}
              <WishlistSheet />
              <CartSheet />
            </div>

            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                href="/login"
                className="text-primary hover:text-primary/90 font-medium 2xl:text-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="md:hidden mb-4">
          <SearchInput />
        </div>
      </Container>
    </nav>
  );
}
