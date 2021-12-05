# [Day 5](https://adventofcode.com/2021/day/5)

In Day 5, you're given a list of vectors in the form `0,9 -> 5,9`. In **Part 1**, you're tasked with finding the number of points where at least two horizontal or vertical vectors intersect. In **Part 2**, you're tasked with finding how often at least two horizontal, vertical, or *diagonal* (strictly 45°) vectors intersect.

As ever, a big piece of solving this Advent of Code puzzle was figuring out the best way to represent the state of the puzzle at any moment. This requires balancing expressiveness with ease of use with memory and performance.

Here, since we're dealing with an *x*–*y* grid, the intuitive representation would typically be a two-dimensional array. This is fine for the test data, where our grid was at most 10 × 10. However, my test data would have produced a 990 × 990 grid, or *980,100 cells*. Not great for memory — especially if many (if not most) of those cells remain unused.

Instead, I turned to an old Advent of Code friend…

## Representing large coordinate spaces as key–value pairs

One tactic I wrote about last year was [using objects to represent coordinate spaces](https://github.com/BenDMyers/Advent_Of_Code_2020/tree/master/17#readme). I wrote about it in the context of solving a multidimensional version of the Conway's Game of Life cellular automaton, in a scenario where the bounds of Conway's cube were prone to expand. Were I to represent Conway's cube as a three-dimensional array, things would get hairy quickly.

In these scenarios, an alternate way you can handle this is as an object or as a map. In this object, the keys are a stringified version of the coordinates — so point `(3, 5)` could have the key `3,5` (or `(3,5)` or `3 5` or whatever you prefer, so long as it's predictable as well as unique for that cell). For today's problem, the value is a number representing the number of vectors that come through that point.

A downside of this object approach is that you don't have ready access to array methods. However, a huge upshot of this approach is that you aren't wasting memory on all those empty cells — the only cells you need in your object are the ones you've determined you needed. Another massive upshot is that you don't need to know how big your coordinate system will need to be ahead of time (as you might when instantiating a multidimensional array), nor is it any work to expand the bounds of your coordinate system.

By the way, if updating an object is too slow for you after time, consider [using a `Map` instead](https://github.com/BenDMyers/Advent_Of_Code_2020/tree/master/15#maps-over-objects).