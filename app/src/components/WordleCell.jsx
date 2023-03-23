import React, { useState, useRef, useEffect } from 'react';

// WordleCell component represents a single cell in the Wordle game grid
const WordleCell = ({
  index,
  selectedCellIndex,
  setSelectedCellIndex,
  focusModifier,
  updateWordList,
  cellState,
}) => {
  // State for storing the letter in the cell
  const [letter, setLetter] = useState('');
  // Reference for focusing the cell
  const cellRef = useRef(null);

  // Function to handle cell click
  const handleClick = () => {
    let nextState = 'notInWord';

    // Determine the next cell state based on the current state
    if (cellState === 'notInWord') {
      nextState = 'correct';
    } else if (cellState === 'correct') {
      nextState = 'inWord';
    } else if (cellState === 'inWord') {
      nextState = 'notInWord';
    }

    // Update the wordList with the new state and set the selected cell index
    updateWordList(index, letter, nextState);
    setSelectedCellIndex(index);
  };

  // Update the wordList when the letter or cell state changes
  useEffect(() => {
    updateWordList(index, letter, cellState);
  }, [letter, cellState]);

  // Focus the cell when the selected cell index changes
  useEffect(() => {
    if (selectedCellIndex === index) {
      cellRef.current.focus();
    }
  }, [selectedCellIndex, index]);

  // Function to handle keydown events on the cell
  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();

    // If the key press is an uppercase letter, update the letter state and move focus
    if (key.match(/^[A-Z]$/)) {
      setLetter(key);
      focusModifier(1);
    }

    // If the key press is an arrow key, move the focus accordingly
    if (key === 'ARROWUP') {
      focusModifier(-5);
    }
    if (key === 'ARROWDOWN') {
      focusModifier(5);
    }
    if (key === 'ARROWLEFT') {
      focusModifier(-1);
    }
    if (key === 'ARROWRIGHT') {
      focusModifier(1);
    }

    // If the key press is a backspace, go back one cell and delete the letter
    if (key === 'BACKSPACE') {
      focusModifier(-1);
      setLetter('');
    }
  };

  // Render the cell with appropriate styling based on cell state and selection
  return (
    <div
      ref={cellRef}
      className={`shadow-sm border border-gray-200 rounded-md h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 flex items-center justify-center text-4xl font-bold ${
        cellState === 'notInWord'
          ? 'bg-white'
          : cellState === 'correct'
          ? 'bg-primary'
          : cellState === 'inWord'
          ? 'bg-secondary'
          : ''
      } ${selectedCellIndex === index ? 'ring-4 ring-primary' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      {letter}
    </div>
  );
};

export default WordleCell;