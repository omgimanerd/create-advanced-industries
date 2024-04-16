// priority: 900

/**
 * JS prototype class to make registering Pneumaticcraft Assembly recipes
 * easier.
 *
 * @constructor
 * @param {Internal.RecipesEventJS} e
 * @param {(Internal.InputFluid_|InputItem_)[]} input
 */
function Assembly(e, input) {
  this.e_ = e
  this.input_ = input

  this.type_ = null
  this.program_ = null
}

/**
 * @constant {string}
 */
Assembly.TYPE_LASER = 'pneumaticcraft:assembly_laser'
/**
 * @constant {string}
 */
Assembly.TYPE_DRILL = 'pneumaticcraft:assembly_drill'
/**
 * @constant {Object<string, string>}
 */
Assembly.PROGRAM_MAP = {}
/**
 * @constant {string}
 */
Assembly.PROGRAM_MAP[Assembly.TYPE_LASER] = 'laser'
/**
 * @constant {string}
 */
Assembly.PROGRAM_MAP[Assembly.TYPE_DRILL] = 'drill'

/**
 * @param {Assembly.TYPE_DRILL|Assembly.TYPE_LASER} type
 * @returns {Assembly}
 */
Assembly.prototype.type = function (type) {
  if (!(type in Assembly.PROGRAM_MAP)) {
    throw new Error(`Unknown type ${type}`)
  }
  this.type_ = type
  this.program_ = Assembly.PROGRAM_MAP[type]
  return this
}

/**
 * @param {OutputItem_} outputs
 * @returns {Internal.RecipeJS}
 */
Assembly.prototype.outputs = function (outputs) {
  if (outputs === undefined) throw new Error('No recipe outputs were specified')
  if (this.type_ === undefined) throw new Error('Recipe type unspecified')
  const base = {
    type: this.type_,
    program: this.program_,
  }

  // Parse the input into the valid JSON format. This recipe must have an input.
  const itemInput = Parser.parseStackedItemInput(this.input_)
  if (itemInput !== null) itemInput.type = 'pneumaticcraft:stacked_item'
  if (!setIfValid(base, 'input', itemInput)) {
    throw new Error(`Invalid input ${itemInput}`)
  }
  // Parse the output into the valid JSON format. This recipe must have an
  // output.
  const itemOutput = Parser.parseItemOutput(outputs)
  if (!setIfValid(base, 'result', itemOutput)) {
    throw new Error(`Invalid output ${itemOutput}`)
  }

  return this.e_.custom(base)
}
