import { Breadcrumb } from "@/components/common/Breadcrumb";

type TBannerProps = {
  bgImage: string;
  title: string;
  description: string;
  breadcrumbs: { label: string; href: string }[];
};

const Banner = ({ bgImage, title, description, breadcrumbs }: TBannerProps) => {
  return (
    <div className="relative h-[250px] md:h-[300px] lg:h-[380px] 2xl:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0  bg-cover bg-center`}
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>

      {/* Gradient Overlay (adaptive for light/dark theme) */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 via-gray-800/80 to-gray-800/80 dark:from-gray-900/80 dark:via-gray-900/80 dark:to-gray-900/80" />

      {/* Centered Content */}
      <div className="relative z-10 px-4 text-center space-y-4 animate-fadeIn">
        <h1 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl text-gray-200 font-semibold uppercase tracking-tight drop-shadow-md">
          {title}
        </h1>
        <p className="text-gray-300 max-w-lg mx-auto text-sm md:text-base 2xl:text-lg">
          {description}
        </p>

        <Breadcrumb items={breadcrumbs} isBanner={true} />
      </div>
    </div>
  );
};

export default Banner;
