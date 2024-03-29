# 🎄 Advent of Code 2021 Solutions

[**Advent of Code**](https://adventofcode.com) is a yearly event where coding challenges are published every day in December leading up to Christmas. Each day's challenges consist of two parts. These coding challenges get progressively harder each day, and solving them efficiently usually requires an understanding of data structures and algorithms.

I'm putting all of my solutions up as I complete them, along with a README that shares my thought process and what I learned.

***

## Running the code

First, clone the repository locally using Git.

```bash
git clone https://github.com/BenDMyers/Advent_Of_Code_2021.git
cd Advent_Of_Code_2021
```

These puzzles require input files. Out of respect for the developers, I'm not committing those input files to this repository. To get a puzzle's input, you'll want to go to the given day's puzzle on [Advent of Code](https://adventofcode.com), and copy the day's given input file. Save the contents of that file to the day's subdirectory as `.input`. For instance, if you want to run Day 7, save the input file as `/07/.input`.

Finally, run the given day's code using the [Node.js](https://nodejs.org) runtime. If you're in the root level of the repository, you can run a given day with `node <subdirectory>`. For instance, to run Day 7's code, run:

```bash
node 07
```

***

## See my solutions

| Day | Takeaways |
|-----|----------|
| [Day 1](/01/) | Arrays and rolling sums |
| [Day 2](/02/) | Direction-and-distance instructions |
| [Day 3](/03/) | Most and least common bits in a list of bitstrings |
| [Day 4](/04/) | Bingo |
| [Day 5](/05/) | Representing multidimensional spaces as objects |
| [Day 6](/06/) | Unsynchronized exponential growth |
| [Day 7](/07/) | Aligning numbers optimally |