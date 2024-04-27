// priority: 1000

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
