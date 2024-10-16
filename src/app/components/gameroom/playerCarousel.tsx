"use client";

import React from 'react';
import Image from 'next/image';
import Carousel from '@/app/components/shared/carousel';
import { Player } from '@/lib/types';

interface PlayerCarouselProps {
  players: (Player | undefined)[];
}

const PlayerCarousel: React.FC<PlayerCarouselProps> = ({ players }) => {
  const renderPlayerItem = (
    player: Player,
    index: number,
    handleSlideClick: (index: number) => void,
    currentIndex: number
  ) => (
    <div
      key={player?.player_id || `player-${index}`} // Use a fallback key if player is undefined
      className={`flex flex-col items-center bg-white w-36 h-36 border rounded-lg transition-all duration-300 ${
        index === currentIndex
          ? 'transform scale-100 z-20 shadow-lg'
          : 'transform scale-90 z-10 opacity-70'
      }`}
      onClick={() => handleSlideClick(index)}
    >
      <div className="relative w-24 h-24 mt-2 mb-2">
        <Image
          src={player.avatar_id ? `/images/avatars/${player.avatar_id}.png` : '/default-avatar.png'}
          alt={player.first_name || player.last_name || 'Player Avatar'}
          width={100}
          height={100}
          className="rounded-full mb-4"
        />

      </div>
      <span className="text-sm font-semibold text-gray-800 text-center px-2 truncate w-full">
        {player.first_name ? `${player.first_name} ${player.last_name}` : player.email}
      </span>
    </div>
  );

  const slidesPerView = players.length === 1 ? 1 : players.length === 2 ? 2 : 3;

  return (
    <div className={`w-full ${players.length === 1 ? 'max-w-[200px]' : players.length === 2 ? 'max-w-[400px]' : 'max-w-[600px]'} mx-auto`}>
      <Carousel
        items={players}
        renderItem={renderPlayerItem}
        slidesPerView={slidesPerView}
        spaceBetween={20}
        centeredSlides={true}
      />
    </div>
  );
};

export default PlayerCarousel;