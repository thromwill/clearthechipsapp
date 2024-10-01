"use client"
import React, { useState } from 'react';
import Modal from 'react-modal';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-6 w-full max-w-xs md:max-w-md">
        <NumberInput maxLength={5} />
        <button
          className="w-full h-10 md:h-12 bg-blue-500 text-white font-medium text-base md:text-lg rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Join Game
        </button>
        <div className="w-full flex justify-center">
          <CreateGame />
        </div>
      </div>
    </div>
  );
}

function NumberInput({ maxLength }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const newValue = event.target.value;

    // Check if the new value exceeds the maxLength and is numeric
    if (newValue.length <= maxLength && /^[0-9]*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <input 
      type="number" 
      value={value} 
      onChange={handleChange} 
      placeholder="Enter Game Pin"
      className="w-full h-12 md:h-16 border border-gray-300 rounded px-4 text-base md:text-lg text-center font-semibold focus:outline-none focus:border-blue-500 hide-caret"
      maxLength={maxLength}
    />
  );
}

function CreateGame() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button
        className="text-blue-500 text-sm font-medium hover:underline"
        onClick={() => setShowModal(true)}
      >
        Create New Game
      </button>
      <Modal 
        className="flex items-center justify-center min-h-screen" 
        isOpen={showModal} 
        onRequestClose={() => setShowModal(false)} 
        contentLabel="Create Game"
      >
        <div className="bg-white p-6 w-full max-w-md max-h-[80vh] rounded-lg overflow-auto">
          {/* Input for Game Name */}
          <input
            type="text"
            placeholder="Game Name"
            className="w-full h-12 border border-gray-300 rounded px-4 text-lg focus:outline-none focus:border-blue-500"
          />

          {/* Dropdown for Stakes */}
          <select className="w-full h-12 border border-gray-300 rounded px-4 text-lg focus:outline-none hover:border-blue-500 my-4">
            <option value="">Select Stakes</option>
            <option value="$0.01 / $0.02">$0.01 / $0.02</option>
            <option value="$0.02 / $0.05">$0.02 / $0.05</option>
            <option value="$0.05 / $0.10">$0.05 / $0.10</option>
            <option value="$0.10 / $0.20">$0.10 / $0.20</option>
            <option value="$0.25 / $0.50">$0.25 / $0.50</option>
            <option value="$0.50 / $1.00">$0.50 / $1.00</option>
          </select>

          {/* Buttons for Create and Cancel */}
          <div className="flex flex-col space-y-4">
            <button className="w-full h-12 bg-blue-500 text-white font-medium text-lg rounded-lg hover:bg-blue-600 transition duration-300">
              Create Game
            </button>
            <button
              className="w-full h-12 bg-gray-500 text-white font-medium text-lg rounded-lg hover:bg-gray-600 transition duration-300"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}