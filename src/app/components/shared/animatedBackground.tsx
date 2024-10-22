import React from 'react';
// import Image from 'next/image';
// import pokerChipImage from '@/public/images/logo.png'; // Adjust the path as needed

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />

      {/* Animated chip grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative w-[200%] h-[200%] animate-slide-diagonal">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-12 h-12 bg-white opacity-50 rounded-full"
              style={{
                top: `${(i % 10) * 20}%`,
                left: `${Math.floor(i / 10) * 20}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Dot overlay */}
      <div 
        className="absolute inset-0 opacity-50" 
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} 
      />

      {/* Fading overlay for top and bottom */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-blue-500 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-blue-500 to-transparent" />
    </div>
  );
};

export default AnimatedBackground;