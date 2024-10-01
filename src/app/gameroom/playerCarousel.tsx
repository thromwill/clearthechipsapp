"use client";

import React from 'react';
import Image from 'next/image';
import Carousel from '../components/carousel';

type Player = {
  id: number;
  name: string;
  avatarPath: string;
};

type PlayerCarouselProps = {
  players: Player[];
};

const PlayerCarousel: React.FC<PlayerCarouselProps> = ({ players }) => {
  const renderPlayerItem = (player: Player, index: number, handleSlideClick: (index: number) => void, currentIndex: number) => (
    <div
      className={`flex flex-col items-center justify-center bg-white w-36 h-36 shadow-lg rounded-lg -mx-4 transition-transform ${
        index === currentIndex ? 'transform scale-100 z-20' : 'transform scale-75 z-10 -translate-y-4'
      }`}
      onClick={() => handleSlideClick(index)}
    >
      <Image src={player.avatarPath} alt={player.name} width={100} height={100} className="rounded-full mb-4" />
      <span className="text-lg font-semibold text-gray-800">{player.name}</span>
    </div>
  );

  return <Carousel items={players} renderItem={renderPlayerItem} />;
};

export default PlayerCarousel;
