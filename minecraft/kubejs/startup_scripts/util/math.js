// priority: 1000

/**
 * @returns {number}
 */
global.randomSeed = () => {
  return (Math.random() * 2 ** 32) >>> 0
}

/**
 * Returns an anonymous function that can be invoked with no arguments and
 * substituted in place for Math.random()
 *
 * @param {Internal.Random_} random An instance of a seeded Random
 * @returns {() => number}
 */
global.wrapSeededRandom = (random) => {
  return () => random.nextDouble()
}

/**
 * In-place array shuffle using the Durstenfield shuffle algorithm.
 * @param {any[]} a
 * @param {() => number} rand
 * @returns {any[]}
 */
global.shuffle = (a, rand) => {
  rand = rand === undefined ? Math.random : rand
  for (let i = a.length - 1; i > 0; --i) {
    let j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Returns a random number in the range [low, high)
 * @param {number} low
 * @param {number=} high
 * @param {() => number} rand
 * @returns {number}
 */
global.randRange = (low, high, rand) => {
  rand = rand === undefined ? Math.random : rand
  if (high === undefined) {
    high = low
    low = 0
  }
  return Math.random() * (high - low) + low
}

/**
 * @param {number} low
 * @param {number=} high
 * @returns {number}
 */
global.randRangeInt = (low, high, rand) => {
  return Math.floor(global.randRange(low, high, rand))
}

/**
 * Returns a random element from the given array, or null if the array is empty.
 * @param {any[]} l
 * @returns {?any}
 */
global.choice = (l, rand) => {
  if (l.length === 0) return null
  return l[global.randRangeInt(0, l.length, rand)]
}

/**
 * Rounds a number x to the nearest base.
 *
 * roundToNearest(66, 100) => 100
 * roundToNearest(73, 25) => 75
 *
 * @param {number} x
 * @param {number} base
 * @returns {number}
 */
global.roundToNearest = (x, base) => {
  return Math.round(x / base) * base
}

/**
 * Clamps the argument number to the two bounds, inclusive.
 *
 * @param {number} x The number to clamp
 * @param {number} a The lower bound, inclusive
 * @param {number} b The upper bound, inclusive
 * @returns {number}
 */
global.clamp = (x, a, b) => {
  return Math.max(a, Math.min(x, b))
}

/**
 * Returns a function which evaluates an input argument x with the exponential
 * function y = ab^(x+d)+c
 *
 * @param {number} a Constant multiplier
 * @param {number} b Exponential base
 * @param {number} c Constant y-offset
 * @param {number} d Constant x-offset
 * @returns {function(number)}
 */
global.exponential = (a, b, c, d) => {
  return (x) => {
    return a * (b ** (x + d)) + c // prettier-ignore
  }
}

/**
 * Adapted from
 * https://github.com/jsantirso/js-combinatorics/blob/master/combinatorics.js
 * @param {number} n
 * @param {number} k
 * @returns {(number[])[]}
 */
global.combinatorics = (n, k) => {
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
}
