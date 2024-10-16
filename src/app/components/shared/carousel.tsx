"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState, ReactNode } from 'react';

type CarouselProps<T> = {
  items: T[];
  slidesPerView?: number;
  spaceBetween?: number;
  centeredSlides?: boolean;
  renderItem: (
    item: T,
    index: number,
    handleSlideClick: (index: number) => void,
    currentIndex: number
  ) => ReactNode;
  onCurrentIndexChange?: (index: number) => void;
};

export default function Carousel<T>({
  items,
  slidesPerView = 3,
  spaceBetween = 20,
  centeredSlides = true,
  renderItem,
  onCurrentIndexChange
}: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleSlideClick = (index: number) => {
    if (!swiperInstance) return;
    swiperInstance.slideTo(index);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.realIndex;
    setCurrentIndex(newIndex);
    if (onCurrentIndexChange) {
      onCurrentIndexChange(newIndex);
    }
  };

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        centeredSlides={centeredSlides}
        loop={items.length > 2}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        pagination={{ 
          clickable: true, 
          el: '.swiper-pagination', 
          bulletClass: 'inline-block w-2 h-2 bg-gray-300 rounded-full mx-1 transition-all duration-300', 
          bulletActiveClass: 'w-4 bg-primary'
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            {renderItem(item, index, handleSlideClick, currentIndex)}
          </SwiperSlide>
        ))}
      </Swiper>

      {items.length > 1 && (
        <div className="flex justify-center items-center mt-4">
          <div className="swiper-pagination flex justify-center"></div>
        </div>
      )}
    </div>
  );
}