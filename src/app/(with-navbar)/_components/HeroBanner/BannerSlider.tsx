"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type TSlide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
};

const slides: TSlide[] = [
  {
    id: 1,
    title: "Apple iPhone 14 Series",
    subtitle: "Up to 10% Off",
    description: "Exclusive voucher on latest iPhones",
    image:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=900&h=600&fit=crop",
    buttonText: "Shop Now",
  },
  {
    id: 2,
    title: "Latest Smartphones",
    subtitle: "Up to 15% Off",
    description: "Hot deals on flagship models",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=600&fit=crop",
    buttonText: "Shop Now",
  },
  {
    id: 3,
    title: "Premium Audio",
    subtitle: "Up to 20% Off",
    description: "Discounts on top-notch headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=600&fit=crop",
    buttonText: "Shop Now",
  },
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // const slideVariants = {
  //   enter: (direction: number) => ({
  //     x: direction > 0 ? 150 : -150,
  //     opacity: 0,
  //     scale: 0.98,
  //   }),
  //   center: {
  //     zIndex: 1,
  //     x: 0,
  //     opacity: 1,
  //     scale: 1,
  //     transition: {
  //       duration: 0.6,
  //       ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  //     },
  //   },
  //   exit: (direction: number) => ({
  //     zIndex: 0,
  //     x: direction < 0 ? 150 : -150,
  //     opacity: 0,
  //     scale: 0.98,
  //     transition: { duration: 0.4 },
  //   }),
  // };
  const slideVariants = {
    enter: (direction: number) => ({
      zIndex: 0, // fade-out slide below
      x: direction > 0 ? 150 : -150,
      opacity: 0,
    }),
    center: {
      zIndex: 10, // active slide above
      x: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <div className="relative w-full h-[360px] md:h-[420px] lg:h-full rounded-lg overflow-hidden group bg-gradient-to-br from-deep-dark to-deep-dark/95">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-between md:gap-4 px-5 md:px-8 lg:px-12 py-12 z-0"
        >
          {/* Text Section */}
          <div className="relative z-20 flex-1 text-center md:text-left space-y-3 sm:space-y-4">
            <motion.div
            // initial={{ opacity: 0, y: 15 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-sm sm:text-base 2xl:text-lg text-gray-300">
                {slides[currentSlide].title}
              </p>

              <h2 className="text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-white">
                {slides[currentSlide].subtitle}
              </h2>

              <p className="text-base sm:text-lg text-gray-300">
                {slides[currentSlide].description}
              </p>

              <Link href="/shop" className="inline-block relative z-30">
                <Button
                  variant="outline"
                  className="mt-4 text-white border-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer font-medium tracking-wide px-6 2xl:px-8 py-2 2xl:py-3 rounded-md"
                >
                  {slides[currentSlide].buttonText}
                  <ArrowRight className="ml-2 w-4 2xl:w-5 h-4 2xl:h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex-1 flex justify-center items-center mt-6 md:mt-0 z-10"
          >
            <div className="relative w-[240px] md:w-[320px] lg:w-[400px] h-[160px] md:h-[240px] lg:h-[280px] rounded-lg">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                className="object-cover drop-shadow-2xl rounded-lg"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between px-2 md:px-4 z-30">
        <button
          onClick={prevSlide}
          className="text-primary transition cursor-pointer "
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="text-primary transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 md:bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-6"
                : "bg-primary/40 w-2 hover:bg-primary/60 cursor-pointer"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
