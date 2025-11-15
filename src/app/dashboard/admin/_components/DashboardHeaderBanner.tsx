const DashboardHeaderBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary/90 via-primary/90 to-primary dark:bg-gradient-to-r dark:from-primary/60 dark:via-primary/60 dark:to-primary/70 text-primary-foreground rounded-xl">
      <div className="px-4 py-6 md:py-8 2xl:py-10 2xl:px-6">
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-bold text-gray-50 mb-[2px]">
              Welcome, Admin
            </h1>
            <p className="text-sm md:text-base 2xl:text-lg text-gray-200 ">
              Manage your store with ease and efficiency
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-10 h-10 md:w-14 md:h-14 2xl:w-16 2xl:h-16 rounded-full backdrop-blur-sm border-2 border-white/90 text-gray-50">
            <span className="md:text-xl font-medium">AD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeaderBanner;
