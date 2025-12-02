'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  id: string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
}

interface ImageCarouselProps {
  slides: Slide[];
  autoPlayInterval?: number;
}

export default function ImageCarousel({
  slides,
  autoPlayInterval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[500px] w-full overflow-hidden md:h-[600px] lg:h-[700px]">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.link ? (
              <Link href={slide.link} className="block h-full">
                <Image
                  src="https://i.pinimg.com/736x/bf/ba/4d/bfba4df228e5639b62dce1aa764ecdf0.jpg"
                  alt={slide.title || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                {(slide.title || slide.description) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="text-center text-white">
                      {slide.title && (
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                          {slide.title}
                        </h2>
                      )}
                      {slide.description && (
                        <p className="mx-auto max-w-2xl text-lg md:text-xl">
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            ) : (
              <>
                <Image
                  src={slide.image}
                  alt={slide.title || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                {(slide.title || slide.description) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="text-center text-white">
                      {slide.title && (
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                          {slide.title}
                        </h2>
                      )}
                      {slide.description && (
                        <p className="mx-auto max-w-2xl text-lg md:text-xl">
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-80 p-2 text-gray-800 transition-all hover:bg-opacity-100 hover:text-rose-600"
            aria-label="Previous slide"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-80 p-2 text-gray-800 transition-all hover:bg-opacity-100 hover:text-rose-600"
            aria-label="Next slide"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-4">
        <Link
          href="/products"
          className="rounded-lg bg-rose-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-rose-700 hover:shadow-xl"
        >
          Xem sản phẩm
        </Link>
        <Link
          href="/about"
          className="rounded-lg border-2 border-white bg-white bg-opacity-20 px-8 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-opacity-30"
        >
          Về chúng tôi
        </Link>
      </div>
    </div>
  );
}
