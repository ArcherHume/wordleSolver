import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'react-feather';
import WordleCell from './WordleCell.jsx';

const Wordle = () => {
  // State variables
  const [rows, setRows] = useState(1);
  const [selectedCellIndex, setSelectedCellIndex] = useState(0);
  const [wordOptions, setWordOptions] = useState([]);
  const [wordList, setWordList] = useState(
    Array.from({ length: 6 }, () => Array(5).fill({ letter: '', state: 'notInWord' }))
  );
  const [filteredWordOptions, setFilteredWordOptions] = useState([]);

  // Fetch word options from the server
  const fetchWordOptions = async () => {
    const response = await fetch('/words.txt');
    const text = await response.text();
    const words = text.split('\n');
    setWordOptions(words);
  };

  // Fetch word options on component mount
  useEffect(() => {
    fetchWordOptions();
  }, []);

  // Update filtered word options when word options change
  useEffect(() => {
    getPossibleWords();
  }, [wordOptions]);

  // Calculate possible words based on word list
  const getPossibleWords = () => {
    // Common letters for sorting words
    const commonLetters = ['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S', 'L', 'C', 'U', 'D', 'P', 'M', 'H', 'G', 'B', 'F', 'Y', 'W', 'K', 'V', 'X', 'Z', 'J', 'Q'];

    // Sort words by common letters
    const sortByCommonLetters = (a, b) => {
      const scoreA = a
        .toLowerCase()
        .split('')
        .reduce((acc, letter) => {
          const letterIndex = commonLetters.indexOf(letter.toUpperCase());
          return acc + (letterIndex !== -1 ? letterIndex : 0);
        }, 0);

      const scoreB = b
        .toLowerCase()
        .split('')
        .reduce((acc, letter) => {
          const letterIndex = commonLetters.indexOf(letter.toUpperCase());
          return acc + (letterIndex !== -1 ? letterIndex : 0);
        }, 0);

      return scoreA - scoreB;
    };

    // Filter possible words based on word list constraints
    const possibleWords = wordOptions.filter((word) => {
      return wordList.every((row) => {
        // If all cells in row are empty, the word is valid
        if (row.every((cell) => cell.letter === "")) {
          return true;
        }

        // Create an array called correctLetters to store letters in the correct position
        const correctLetters = [];
        
        // Add the correct letters to the array
        row.forEach((cell, cellIndex) => {
          if (cell.state === 'correct' && cell.letter !== "") {
            correctLetters.push(cell.letter.toLowerCase());
          }
        });

        // Check if word meets row constraints
        let nonDoubles = [];
        const rowResult = row.every((cell, cellIndex) => {
          // Check for not in word letters
          if (cell.state === 'notInWord' && cell.letter !== "" && correctLetters.includes(cell.letter.toLowerCase())) {
            nonDoubles.push(cell.letter.toLowerCase());
          }

          // Check for not in word letters that should not be in the word
          if (cell.state === 'notInWord' && cell.letter !== "" && !correctLetters.includes(cell.letter.toLowerCase())) {
            if (word.includes(cell.letter.toLowerCase())) {
              return false;
            }
          }

          // Check for in word letters
          if (cell.state === 'inWord' && cell.letter !== "") {
            if (!word.includes(cell.letter.toLowerCase()) || word[cellIndex] === cell.letter.toLowerCase()) {
              return false;
            }
          }

          // Check for correct letters
          if (cell.state === 'correct' && cell.letter !== "") {
            correctLetters.push(cell.letter.toLowerCase());
            if (word[cellIndex] !== cell.letter.toLowerCase()) {
              return false;
            }
          }

          return true;
        });

        // Check for non-doubles constraint
        if (rowResult) {
          for (const letter of nonDoubles) {
            const letterCountInWord = word.split('').filter((char) => char === letter).length;
            if (letterCountInWord > 1) {
              return false;
            }
          }
        }

        return rowResult;
      });
    });

    // Update filtered word options
    setFilteredWordOptions(possibleWords.sort(sortByCommonLetters));
  };

  // Update word list based on user input
  const updateWordList = (index, letter, state) => {
    const rowIndex = Math.floor(index / 5);
    const cellIndex = index % 5;

    setWordList((prevWordList) => {
      const newWordList = [...prevWordList];
      newWordList[rowIndex][cellIndex] = { letter, state };
      return newWordList;
    });
  };

  // Update possible words when word list changes
  useEffect(() => {
    getPossibleWords();
  }, [wordList]);

  // Focus modifier for navigating between cells
  const focusModifier = (modifier) => {
    const cells = document.querySelectorAll('[role="button"]');
    const currentIndex = selectedCellIndex;
    const nextIndex = (currentIndex + modifier) % cells.length;
    setSelectedCellIndex(nextIndex >= 0 ? nextIndex : 0);
  };

  // Render the Wordle component
  return (
    <>
      <div className='flex flex-row justify-center mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl font-semibold text-gray-700'>
            Wordle Solver
          </h1>
          <h3 className='text-gray-400 text-md text-center'>
            by Archer Hume
          </h3>
        </div>
      </div>
      <div className="flex justify-around pt-8 min-h-screen">
        <div className="w-3/12 p-10">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <div className='h-[50vh] p-3 font-mono overflow-auto border border-gray-200 bg-box rounded-md shadow-sm'>
            <p>
              Typing:
              Click on a cell to select it. Type a letter to fill it in, each time a letter is typed, the next cell will focus.
            </p>
            <p className='mt-4'>
              Changing cell colour:
              Click a cell to cycle through colours. Thats it!
            </p>
          </div>
        </div>
        <div className="w-6/12">
          <div className="grid grid-rows-6 gap-2">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <div className="flex flex-row gap-2 justify-center" key={`row-${rowIndex}`}>
                {Array.from({ length: 5 }, (_, cellIndex) => (
                  <WordleCell
                    key={`cell-${cellIndex}`}
                    index={rowIndex * 5 + cellIndex}
                    selectedCellIndex={selectedCellIndex}
                    setSelectedCellIndex={setSelectedCellIndex}
                    focusModifier={focusModifier}
                    updateWordList={updateWordList}
                    cellState={wordList[rowIndex][cellIndex].state}
                  />
                ))}
              </div>
            ))}
            <div className='flex flex-row gap-3 w-fit mx-auto'>
              <button
                className="mt-4 w-fit h-min bg-gray-700 text-gray-400 text-xl p-1 rounded-lg"
                onClick={() => { rows < 6 ? setRows(rows + 1) : null }}
              >
                <Plus />
              </button>
              <button
                className="mt-4 w-fit h-min bg-gray-700 text-gray-400 text-xl p-1 rounded-lg"
                onClick={() => { setWordList([...wordList.slice(0, rows - 1), Array(5).fill({ letter: '', state: 'notInWord' }), ...wordList.slice(rows)]); rows > 1 ? setRows(rows - 1) : null; }}
              >
                <Minus />
              </button>
            </div>
          </div>
        </div>
        <div className="w-3/12 p-10">
          <h2 className="text-xl font-semibold mb-4">Possible Words (Top 50):</h2>
          <pre className='h-[50vh] overflow-scroll border border-gray-200 bg-box rounded-md shadow-sm'>
            {filteredWordOptions.slice(0,50).join("\n")}
          </pre>
        </div>
      </div>
    </>
  );
};

export default Wordle;