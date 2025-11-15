const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h2 className="relative pl-8 md:pl-9 text-xl md:text-[22px] 2xl:text-2xl font-bold uppercase before:content-[''] before:absolute before:left-1 before:bottom-2 before:h-[16px] md:before:h-[18px] 2xl:before:h-[20px] before:w-[15px] before:border-l-[5px] before:border-r-[5px] before:border-primary before:transform before:-skew-x-[26deg]">
      {title}
    </h2>
  );
};
export default SectionTitle;
