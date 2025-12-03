'use client';

import { useState, useEffect } from 'react';
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

  if (slides.length === 0) {
    console.warn('ImageCarousel: No slides provided');
    return null;
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-gray-900 md:h-[600px] lg:h-[700px]">
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 ${
              index === currentIndex ? 'z-10' : 'z-0 pointer-events-none'
            }`}
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              visibility: index === currentIndex ? 'visible' : 'hidden',
            }}
          >
            {/* Image - đảm bảo luôn hiển thị với opacity 1 */}
            <img
              src={slide.image}
              alt={slide.title || `Slide ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: 1,
              }}
              onError={(e) => {
                console.error('Image load error:', slide.image, e);
                const target = e.target as HTMLImageElement;
                target.style.backgroundColor = '#1f2937';
              }}
              onLoad={(e) => {
                console.log(
                  'Image loaded successfully:',
                  slide.image,
                  'Index:',
                  index,
                  'Current:',
                  currentIndex
                );
                const target = e.target as HTMLImageElement;
                // Force opacity to 1 if this is the current slide
                if (index === currentIndex) {
                  target.style.setProperty('opacity', '1', 'important');
                }
              }}
            />
            {/* Overlay with text - chỉ hiển thị khi slide active */}
            {index === currentIndex && (slide.title || slide.description) && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
                  zIndex: 10,
                }}
              >
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
            {/* Clickable link overlay - chỉ click được khi slide active */}
            {slide.link && index === currentIndex && (
              <Link
                href={slide.link}
                className="absolute inset-0 z-20 cursor-pointer"
                aria-label={slide.title || `Go to ${slide.link}`}
                style={{ zIndex: 20, cursor: 'pointer' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-white bg-opacity-80 p-2 text-gray-800 transition-all hover:bg-opacity-100 hover:text-rose-600 hover:scale-110 active:scale-95"
            aria-label="Previous slide"
            style={{ zIndex: 30, cursor: 'pointer' }}
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
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-white bg-opacity-80 p-2 text-gray-800 transition-all hover:bg-opacity-100 hover:text-rose-600 hover:scale-110 active:scale-95"
            aria-label="Next slide"
            style={{ zIndex: 30, cursor: 'pointer' }}
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
        <div
          className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2"
          style={{ zIndex: 30 }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 cursor-pointer rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-125'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      )}

      {/* CTA Buttons */}
      <div
        className="absolute bottom-20 left-1/2 z-30 flex -translate-x-1/2 gap-4"
        style={{ zIndex: 30 }}
      >
        <Link
          href="/products"
          className="cursor-pointer rounded-lg bg-rose-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-rose-700 hover:shadow-xl hover:scale-105 active:scale-95"
          style={{ cursor: 'pointer' }}
        >
          Xem sản phẩm
        </Link>
        <Link
          href="/about"
          className="cursor-pointer rounded-lg border-2 border-white bg-white px-8 py-3 text-base font-semibold text-black transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
          style={{ cursor: 'pointer' }}
        >
          Về chúng tôi
        </Link>
      </div>
    </div>
  );
}
