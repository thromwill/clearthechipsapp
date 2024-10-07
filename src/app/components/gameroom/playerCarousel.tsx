"use client";

import React from 'react';
import Image from 'next/image';
import Carousel from '@/app/components/shared/carousel';
import { Player } from '@/lib/types';

interface PlayerCarouselProps {
  players: Player[];
}

const PlayerCarousel: React.FC<PlayerCarouselProps> = ({ players }) => {
  const renderPlayerItem = (
    player: Player,
    index: number,
    handleSlideClick: (index: number) => void,
    currentIndex: number
  ) => (
    <div
      key={player.player_id}
      className={`flex flex-col items-center bg-white -mx-11 w-36 h-36 border rounded-lg transition-transform ${
        index === currentIndex ? 'transform scale-100 z-20' : 'transform scale-75 z-10 -translate-y-4'
      }`}
      onClick={() => handleSlideClick(index)}
    >
      <Image
        src={player.avatar_id ? `/avatars/${player.avatar_id}` : '/default-avatar.png'}
        alt={player.first_name || player.last_name || 'Player Avatar'}
        width={100}
        height={100}
        className="rounded-full mb-4"
      />
      <span className="text-med font-semibold text-gray-800">
        {player.first_name ? `${player.first_name} ${player.last_name}` : player.email}
      </span>
    </div>
  );

  return (
    <Carousel
      items={players}
      renderItem={renderPlayerItem}
      slidesPerView={3}
      spaceBetween={90}
      centeredSlides={true}
    />
  );
};

export default PlayerCarousel;
