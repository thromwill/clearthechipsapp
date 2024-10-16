"use client";

import React from 'react';
import Carousel from '@/app/components/shared/carousel';
import { ChipCase } from '@/lib/types';
import ChipCaseCard from './chipCaseCard';

type ChipCaseCarouselProps = {
  chipCases: ChipCase[];
  onCurrentIndexChange?: (index: number) => void;
  onEditChipCase: (chipCase: ChipCase) => void;
  onDeleteChipCase: (chipCase: ChipCase) => void;
};

const ChipCaseCarousel: React.FC<ChipCaseCarouselProps> = ({
  chipCases,
  onCurrentIndexChange,
  onEditChipCase,
  onDeleteChipCase,
}) => {
  const renderChipCaseItem = (
    chipCase: ChipCase,
    index: number,
    handleSlideClick: (index: number) => void,
    currentIndex: number
  ) => (
    <ChipCaseCard
      chipCase={chipCase}
      isActive={index === currentIndex}
      onEdit={() => onEditChipCase(chipCase)}
      onDelete={() => onDeleteChipCase(chipCase)}
      onClick={() => handleSlideClick(index)}
    />
  );

  return (
    <div className="w-full max-w-full mx-auto">
      <Carousel
        items={chipCases}
        renderItem={renderChipCaseItem}
        slidesPerView={3}
        spaceBetween={10}
        centeredSlides={true}
        onCurrentIndexChange={onCurrentIndexChange}
      />
    </div>
  );
};

export default ChipCaseCarousel;