"use client";

import React, { useState } from "react";
import { Coins } from 'lucide-react';

interface Chip {
  color: string;
  value: number;
}

interface ChipValuesModalProps {
  onClose: () => void;
  chipValues: Record<string, number>; // More concise typing for objects
}

interface ChipValuesProps {
  chipValues: Record<string, number>;
}

const ChipValues: React.FC<ChipValuesProps> = ({ chipValues }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div>
      <button 
        onClick={() => setShowModal(true)} 
        aria-label="Open chip values menu"
        className="flex items-center p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Coins className="w-6 h-6" />
      </button>


      {showModal && (
        <ChipValuesModal
          chipValues={chipValues}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const ChipValuesModal: React.FC<ChipValuesModalProps> = ({
  onClose,
  chipValues,
}) => {
  const convertedChipValues: Chip[] = Object.entries(chipValues)
    .sort(([, valueA], [, valueB]) => valueA - valueB)
    .map(([color, value]) => ({
      color,
      value: typeof value === "number" ? value : parseInt(value, 10) || 0,
    }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Chip Values</h2>

        <div className="flex flex-col">
          {convertedChipValues.length > 0 ? (
            convertedChipValues.map(({ color, value }) => (
              <div key={color} className="flex justify-between mb-2">
                <span>{color}:</span>
                <span>{`$${value}`}</span>
              </div>
            ))
          ) : (
            <p>No chip values available.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded float-right"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChipValues;
