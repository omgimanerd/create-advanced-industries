// priority: 1000

/**
 * Returns a random number in the range [low, high)
 * @param {number} low
 * @param {number=} high
 * @returns {number}
 */
const randRange = (low, high) => {
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
const randRangeInt = (low, high) => {
  return Math.floor(randRange(low, high))
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
const roundToNearest = (x, base) => {
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
const clamp = (x, a, b) => {
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
const exponential = (a, b, c, d) => {
  return (x) => {
    return a * (b ** (x + d)) + c // prettier-ignore
  }
}
