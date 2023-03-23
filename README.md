# Wordle Solver 🧩

A web app built with Astro.build and React that provides suggestions for the Wordle game based on possible words and prioritizes those containing common letters in the English language.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Data Science Concepts](#data-science-concepts)
- [Contributing](#contributing)
- [License](#license)

## Installation

Clone this repository:

```
git clone https://github.com/username/wordle-solver.git
```

Navigate to the project directory and install dependencies:

```
cd wordle-solver
npm install
```

Start the development server:

```
npm run dev
```

Open your browser and go to `http://localhost:3000`.

## Usage

1. Type the letters in each cell of the Wordle grid. The app will automatically move to the next cell after typing a letter.
2. Click on a cell to change its color (state). There are three states:
   - White: The letter is not in the word.
   - Yellow: The letter is in the word but not in the correct position.
   - Green: The letter is in the word and in the correct position.
3. The app will display a list of possible words (Top 50) on the right side based on the input provided.
4. Use the arrow keys to navigate between cells.

## Data Science Concepts 💡

The Wordle Solver demonstrates the application of the following data science concepts:

- **Algorithms**: Filtering and sorting algorithms are used to generate possible words based on the input from the Wordle grid. The `getPossibleWords` function filters the word list based on the constraints provided by the grid and sorts the possible words based on the frequency of common letters.

- **Filtering**: Wordle Solver filters the list of possible words by checking if each word meets the constraints of the grid. It uses the `every` function to ensure that all rows of the grid are satisfied by the selected word.

- **Sorting**: The Wordle Solver sorts the possible words based on the frequency of common letters in the English language. The `sortByCommonLetters` function calculates a score for each word based on the position of its letters in the `commonLetters` array, then sorts the words based on their scores.

## Contributing 🤝

If you have any improvement suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
