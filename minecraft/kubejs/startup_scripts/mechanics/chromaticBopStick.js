// priority: 500
// Globals constants for the Chromatic Bop Stick

// Ordered list of colors, indexed by the data value that would be present in
// a sheep of this color.
//
// The Chromatic Bop Stick will not allow a white charge, but it is present in
// this data list because a sheep with Color NBT 0 will be white.
global.CHROMATIC_BOP_STICK_COLORS = [
  'white',
  'orange',
  'magenta',
  'light_blue',
  'yellow',
  'lime',
  'pink',
  'gray',
  'light_gray',
  'cyan',
  'purple',
  'blue',
  'brown',
  'green',
  'red',
  'black',
]

// Colors sampled from the colored wool textures, used to color the squares in
// the Chromatic Bop Stick's dynamic tooltip.
global.CHROMATIC_BOP_STICK_COLOR_MAP = {
  white: 0xdde1e1,
  orange: 0xe46606,
  magenta: 0xb33ba9,
  light_blue: 0x4dc3e4,
  yellow: 0xf3bb1f,
  lime: 0x67b018,
  pink: 0xe97d9f,
  gray: 0x35383c,
  light_gray: 0x7f7f76,
  cyan: 0x157a88,
  purple: 0x7024a3,
  blue: 0x2b2d8d,
  brown: 0x633d21,
  green: 0x313e15,
  red: 0x902120,
  black: 0x141419,
}
