// priority: 1000
// Utilities for random number generation.

/**
 * Returns a random element from the given array, or null if the array is empty.
 *
 * @param {any[]} l
 * @param {() => number} [rand] Random number generator to use, defaults to
 *   Math.random()
 * @returns {?any}
 */
const choice = (global.choice = (l, rand) => {
  if (l.length === 0) return null
  return l[randRangeInt(0, l.length, rand)]
})

/**
 * Given an non-negative integer n and a non-negative integer k, returns all
 * the possible combinations of k elements from the set of integers [0, n).
 *
 * Adapted from
 * https://github.com/jsantirso/js-combinatorics/blob/master/combinatorics.js
 *
 * @param {number} n
 * @param {number} k
 * @returns {(number[])[]}
 */
const combinatorics = (global.combinatorics = (n, k) => {
  let combinations = []
  let pointers = Array(k)
    .fill(0)
    .map((_, i) => i)
  // A flag set to true when we have processed the current combination length
  let finished = false
  while (!finished) {
    // We process the current combination
    combinations.push(pointers.slice())
    // We find the first pointer that we can advance, starting from the right
    for (let pointer = k - 1; pointer >= 0; pointer--) {
      if (pointers[pointer] < n - (k - pointer)) {
        // We can advance it
        pointers[pointer]++
        // We fix the next pointers
        // Current Rhino build does not allow this to be declared in the loop
        let fixPointer = pointer + 1,
          i = 1
        for (; fixPointer < k; fixPointer++, i++) {
          pointers[fixPointer] = pointers[pointer] + i
        }
        break
      } else {
        // We can't advance it.
        // If it was the leftmost one, we are done with this combination length
        if (!pointer) finished = true
      }
    }
  }
  return combinations
})

/**
 * Generates an alias table using the Vose Alias method and returns a closure
 * that returns a random key from the given table at the given probability each
 * time it is called.
 *
 * https://www.keithschwarz.com/darts-dice-coins/
 *
 * Transcribed from Java implementation:
 * https://www.keithschwarz.com/interesting/code/?dir=alias-method
 *
 * @param {{ any : number }} m A mapping of values to integral selection weights
 * @param {() => number} [rand] Random number generator to use, defaults to
 *   Math.random()
 * @returns {() => any}
 */
const getVoseAliasSampler = (global.getVoseAliasSampler = (m, rand) => {
  rand = rand === undefined ? Math.random : rand
  // Depends on the deterministic iteration order across object m
  const keys = Object.keys(m)
  const weights = Object.values(m)
  const size = keys.length
  const weightSum = weights.reduce((acc, v) => acc + v)
  // Convert the weights to fractional probabilities
  const probabilities = weights.map((v) => v / weightSum)

  // Create empty probability and alias lookup tables
  const probability = Array(size)
  const alias = Array(size)

  // Compute the average probability with size discrete buckets
  const average = 1 / size

  // Small and large worktables for the Vose Alias method, push the index of the
  // probability
  const small = []
  const large = []
  probabilities.forEach((p, i) => {
    if (p >= average) {
      large.push(i)
    } else {
      small.push(i)
    }
  })

  // Pair together small and large elements to populate the probability table
  while (small.length > 0 && large.length > 0) {
    let less = small.pop()
    let more = large.pop()
    // Scale the probability up by the number of probabilities such that 1 /
    // size has weight 1.0 in the distribution
    probability[less] *= size
    alias[less] = more
    // Decrease the probability of the larger bucket by the amount allocated to
    // the alias table.
    probabilities[more] += probabilities[less] - average
    // Add the new probability to the correct list.
    if (probabilities[more] >= average) {
      large.push(more)
    } else {
      small.push(more)
    }
  }

  // Floating point precision leaves entries in one list, meaning the remaining
  // probabilities are 1 / n. Add the remaining values to the probability
  // lookup table.
  small.concat(large).forEach((v) => {
    probability[v] = 1
  })

  // Return a closure that will return a key with the correct probability
  return () => {
    const column = Math.floor(rand() * size)
    const coinToss = rand() < probability[column]
    return keys[coinToss ? column : alias[column]]
  }
})

/**
 * Returns a random number in the range [low, high).
 *
 * @param {number} low
 * @param {number=} high
 * @param {() => number} [rand] Random number generator to use, defaults to
 *   Math.random()
 * @returns {number}
 */
const randRange = (global.randRange = (low, high, rand) => {
  rand = rand === undefined ? Math.random : rand
  if (high === undefined) {
    high = low
    low = 0
  }
  return Math.random() * (high - low) + low
})

/**
 * Returns a random integer in the range [low, high).
 * @param {number} low
 * @param {number=} high
 * @param {() => number} [rand] Random number generator to use, defaults to
 *   Math.random()
 * @returns {number}
 */
const randRangeInt = (global.randRangeInt = (low, high, rand) => {
  return Math.floor(randRange(low, high, rand))
})

/**
 * Returns a random number that can be used as a seed for an RNG.
 *
 * @returns {number}
 */
const randomSeed = (global.randomSeed = () => {
  return (Math.random() * 2 ** 32) >>> 0
})

/**
 * In-place array shuffle using the Durstenfield shuffle algorithm.
 *
 * @param {any[]} a
 * @param {() => number} [rand] Random number generator to use, defaults to
 *   Math.random()
 * @returns {any[]}
 */
const shuffle = (global.shuffle = (a, rand) => {
  rand = rand === undefined ? Math.random : rand
  for (let i = a.length - 1; i > 0; --i) {
    let j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
})

/**
 * Returns an anonymous function that can be invoked with no arguments and
 * substituted in place for Math.random()
 *
 * @param {Internal.Random_} random An instance of a seeded Random
 * @returns {() => number}
 */
const wrapSeededRandom = (global.wrapSeededRandom = (random) => {
  return () => random.nextDouble()
})
