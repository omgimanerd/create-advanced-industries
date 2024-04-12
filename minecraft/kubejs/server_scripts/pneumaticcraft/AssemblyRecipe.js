// priority: 900

// JS prototype class to make registering Pneumaticcraft Assembly Recipes
// easier.

function AssemblyRecipe(e, input) {
  this.e_ = e
  this.input_ = input

  this.type_ = null
  this.program_ = null
}

AssemblyRecipe.TYPE_LASER = 'pneumaticcraft:assembly_laser'
AssemblyRecipe.TYPE_DRILL = 'pneumaticcraft:assembly_drill'
AssemblyRecipe.PROGRAM_MAP = {}
AssemblyRecipe.PROGRAM_MAP[AssemblyRecipe.TYPE_LASER] = 'laser'
AssemblyRecipe.PROGRAM_MAP[AssemblyRecipe.TYPE_DRILL] = 'drill'

AssemblyRecipe.prototype.type = function (type) {
  if (!(type in AssemblyRecipe.PROGRAM_MAP)) {
    throw new Error(`Unknown type ${type}`)
  }
  this.type_ = type
  this.program_ = AssemblyRecipe.PROGRAM_MAP[type]
  return this
}

AssemblyRecipe.prototype.outputs = function (output) {
  if (outputs === undefined) throw new Error('No recipe outputs were specified')
  const base = {
    type: this.type_,
    program: this.program_,
  }

  // Parse the input into the valid JSON format. This recipe must have an input.
  const itemInput = PneumaticcraftUtils.parseStackedItemInput(this.input_)
  if (!PneumaticcraftUtils.setIfValid(base, 'input', itemInput)) {
    throw new Error(`Invalid input ${itemInput}`)
  }
  // Parse the output into the valid JSON format. This recipe must have an
  // output.
  const itemOutput = PneumaticcraftUtils.parseItemOutput(output)
  if (!PneumaticcraftUtils.setIfValid(base, 'result', itemOutput)) {
    throw new Error(`Invalid output ${itemOutput}`)
  }

  if (PneumaticcraftUtils.LOG_DEBUG_OUTPUT) {
    console.log(JSON.stringify(base))
  }

  return this.e_.custom(base)
}
