import { Button } from "@/components/ui/button";
import { BookOpenIcon, HomeIcon, MapIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-3xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Illustration */}
        <div className="relative w-full max-w-md h-64 sm:h-80">
          <Image
            src="/images/others/not-found-image.jpg"
            alt="not-found-image"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="space-y-2 mb-6">
            <h1 className="text-7xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">
              Page Not Found
            </h2>
            <p className="text-gray-600 max-w-md">
              Looks like you&apos;ve ventured off the beaten path. The page
              you&apos;re looking for has either moved or doesn&apos;t exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="transition-all hover:scale-105"
            >
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="w-auto transition-all hover:scale-105"
            >
              <Link href="/dashboard/user">
                <BookOpenIcon className="mr-2 h-4 w-4" />
                Go Profile
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500 flex items-center">
            <MapIcon className="h-4 w-4 mr-2" />
            <span>Need directions? Try using the navigation menu above.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
