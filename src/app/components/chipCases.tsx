"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import ChipCaseImage from '@/public/images/chipCase.png';
import Carousel from "../components/carousel";

type ChipCase = {
  id: number;
};

export default function ChipCases() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chipCases, setChipCases] = useState<ChipCase[]>([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAddChipCase = () => {
    if (chipCases.length < 12) {
      const newId = chipCases.length + 1;
      setChipCases([...chipCases, { id: newId }]);
    }
  };

  const handleRemoveChipCase = (index: number) => {
    const updatedCases = chipCases.filter((_, i) => i !== index);
    setChipCases(updatedCases);
  };

  const handleEditChipCase = (index: number, newId: number) => {
    const updatedCases = [...chipCases];
    updatedCases[index] = { id: newId };
    setChipCases(updatedCases);
  };

  const renderChipCaseItem = (
    chipCase: ChipCase,
    index: number,
    handleSlideClick: (index: number) => void,
    currentIndex: number
  ) => (
    <div
      className={`flex flex-col items-center justify-center bg-white w-36 h-36 shadow-lg rounded-lg -mx-4 transition-transform ${
        index === currentIndex
          ? "transform scale-100 z-20"
          : "transform scale-75 z-10 -translate-y-4"
      }`}
      onClick={() => handleSlideClick(index)}
    >
      <Image
        src={ChipCaseImage}
        alt={`Chip Case ${chipCase.id}`}
        width={100}
        height={100}
        className="mb-4"
      />
      <span className="text-sm font-semibold">Chip Case {chipCase.id}</span>
    </div>
  );

  return (
    <div>
      {/* Button to open the chip cases modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Your Chip Cases
      </button>

      {/* Modal for chip cases */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Chip Cases Modal"
        className="flex items-center justify-center min-h-screen"
      >
        <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Chip Cases</h2>

          {/* ChipCases carousel component */}
          <Carousel
            items={chipCases}
            renderItem={renderChipCaseItem}
          />

          {/* Button to add a new chip case */}
          <button
            onClick={handleAddChipCase}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            New Case
          </button>

          {/* Button to edit the first chip case for demonstration */}
          <button
            onClick={() => handleEditChipCase(0, 999)} // Example edit
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Edit
          </button>

          {/* Close modal button */}
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
