// priority: 900

// JS prototype class to make registering Pneumaticcraft Assembly Recipes
// easier.

function Assembly(e, input) {
  this.e_ = e
  this.input_ = input

  this.type_ = null
  this.program_ = null
}

Assembly.TYPE_LASER = 'pneumaticcraft:assembly_laser'
Assembly.TYPE_DRILL = 'pneumaticcraft:assembly_drill'
Assembly.PROGRAM_MAP = {}
Assembly.PROGRAM_MAP[Assembly.TYPE_LASER] = 'laser'
Assembly.PROGRAM_MAP[Assembly.TYPE_DRILL] = 'drill'

Assembly.prototype.type = function (type) {
  if (!(type in Assembly.PROGRAM_MAP)) {
    throw new Error(`Unknown type ${type}`)
  }
  this.type_ = type
  this.program_ = Assembly.PROGRAM_MAP[type]
  return this
}

Assembly.prototype.outputs = function (output) {
  if (outputs === undefined) throw new Error('No recipe outputs were specified')
  const base = {
    type: this.type_,
    program: this.program_,
  }

  // Parse the input into the valid JSON format. This recipe must have an input.
  const itemInput = Parser.parseStackedItemInput(this.input_)
  if (!setIfValid(base, 'input', itemInput)) {
    throw new Error(`Invalid input ${itemInput}`)
  }
  // Parse the output into the valid JSON format. This recipe must have an
  // output.
  const itemOutput = Parser.parseItemOutput(output)
  if (!setIfValid(base, 'result', itemOutput)) {
    throw new Error(`Invalid output ${itemOutput}`)
  }

  return this.e_.custom(base)
}
