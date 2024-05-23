// priority: 1000

/**
 * Returns a random number in the range [low, high)
 * @param {number} low
 * @param {number=} high
 * @returns {number}
 */
global.randRange = (low, high) => {
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
global.randRangeInt = (low, high) => {
  return Math.floor(global.randRange(low, high))
}

/**
 * Returns a random element from the given array, or null if the array is empty.
 * @param {any[]} l
 * @returns {?any}
 */
global.choice = (l) => {
  if (l.length === 0) return null
  return l[global.randRangeInt(0, l.length)]
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
