"use client";

import React from 'react';
import Image from 'next/image';
import ChipCaseImage from '@/public/images/chip_case.png';
import Carousel from '@/app/components/shared/carousel';
import { ChipCase } from '@/lib/types';

type ChipCaseCarouselProps = {
  chipCases: ChipCase[];
};

const ChipCaseCarousel: React.FC<ChipCaseCarouselProps> = ({ chipCases }) => {
  const renderChipCaseItem = (chipCase: ChipCase, index: number, handleSlideClick: (index: number) => void, currentIndex: number) => (
    <div
      className={`flex flex-col items-center bg-white -mx-11 w-36 h-36 border rounded-lg transition-transform ${
        index === currentIndex ? 'transform scale-100 z-20' : 'transform scale-75 z-10 -translate-y-4'
      }`}
      onClick={() => handleSlideClick(index)}
    >
      <Image src={ChipCaseImage} alt={chipCase.case_name || "Chip Case"} width={100} height={100} className="rounded-full mb-4" />
      <span className="text-med font-semibold text-gray-800">{chipCase.case_name}</span>
    </div>
  );

  return (
    <Carousel
      items={chipCases}
      renderItem={renderChipCaseItem}
      slidesPerView={3}
      spaceBetween={50}
      centeredSlides={true}
    />
  );
};

export default ChipCaseCarousel;
