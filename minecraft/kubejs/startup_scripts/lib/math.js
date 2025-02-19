// priority: 1000
// Utilities for mathematical operations.

/**
 * Clamps the argument number to the two bounds, inclusive.
 *
 * @param {number} x The number to clamp
 * @param {number} a The lower bound, inclusive
 * @param {number} b The upper bound, inclusive
 * @returns {number}
 */
const clamp = (global.clamp = (x, a, b) => {
  return Math.max(a, Math.min(x, b))
})

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
const exponential = (global.exponential = (a, b, c, d) => {
  return (x) => {
    return a * (b ** (x + d)) + c // prettier-ignore
  }
})

/**
 * Returns the linear interpolation of a given value from one range to another.
 * @param {number} x The value to interpolate
 * @param {number} min The min value of the range to lerp from
 * @param {number} max The max value of the range to lerp from
 * @param {number} newMin The min value of the range to lerp to
 * @param {number} newMax The max value of the range to lerp to
 * @returns {number}
 */
const lerp = (global.lerp = (x, min, max, newMin, newMax) => {
  const r = max - min
  const newR = newMax - newMin
  const ratio = (x - min) / r
  return newMin + ratio * newR
})

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
const roundToNearest = (global.roundToNearest = (x, base) => {
  return Math.round(x / base) * base
})
