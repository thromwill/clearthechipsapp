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
    <div className="w-full max-w-sm my-4 relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        centeredSlides={centeredSlides}
        loop={true}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        pagination={{ clickable: true, el: '.swiper-pagination', bulletClass: 'custom-bullet', bulletActiveClass: 'custom-bullet-active' }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            {renderItem(item, index, handleSlideClick, currentIndex)}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center items-center mt-8">
        <div className="swiper-pagination flex justify-center"></div>
      </div>
    </div>
  );
}