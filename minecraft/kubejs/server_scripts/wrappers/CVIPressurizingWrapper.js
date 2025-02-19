// priority: 1000

/**
 * @param {Internal.RecipesEventJS_} e
 * @param {($InputItem_|$InputFluid_)[]} inputs
 */
function CVIPressurizingWrapper(e, inputs) {
  this.e_ = e
  this.inputs_ = inputs

  this.secondaryFluidInput_ = null
  this.secondaryFluidOutput_ = null

  this.processingTime_ = 40
  this.heatRequirement_ = null

  /**
   * @param {Internal.InputFluid_} fluid
   * @returns {CVIPressurizingWrapper}
   */
  this.secondaryFluidInput = (fluid) => {
    if (this.secondaryFluidOutput_ !== null) {
      throw new Error(
        'Recipe cannot have both a secondary fluid input and output'
      )
    }
    this.secondaryFluidInput_ = fluid
    return this
  }

  /**
   * @param {Internal.InputFluid_} fluid
   * @returns {CVIPressurizingWrapper}
   */
  this.secondaryFluidOutput = (fluid) => {
    if (this.secondaryFluidInput_ !== null) {
      throw new Error(
        'Recipe cannot have both a secondary fluid input and output'
      )
    }
    this.secondaryFluidOutput_ = fluid
    return this
  }

  /**
   * @param {number} processingTime
   * @returns {CVIPressurizingWrapper}
   */
  this.processingTime = (processingTime) => {
    this.processingTime_ = processingTime
    return this
  }

  /**
   * @returns {CVIPressurizingWrapper}
   */
  this.heated = () => {
    this.heatRequirement_ = 'heated'
    return this
  }

  /**
   * @returns {CVIPressurizingWrapper}
   */
  this.superheated = () => {
    this.heatRequirement_ = 'superheated'
    return this
  }

  /**
   * @param {($OutputItem_|$OutputFluid_)[]} results
   * @returns {Internal.RecipeJS_}
   */
  this.outputs = (results) => {
    this.inputs_ = Array.isArray(this.inputs_) ? this.inputs_ : [this.inputs_]
    results = Array.isArray(results) ? results : [results]

    let recipe
    if (this.secondaryFluidInput_ !== null) {
      this.inputs_ = [this.secondaryFluidInput_].concat(this.inputs_)
      recipe = this.e_.recipes.vintageimprovements
        .pressurizing(results, this.inputs_)
        .secondaryFluidInput(0)
    } else if (this.secondaryFluidOutput_ !== null) {
      results = [this.secondaryFluidOutput_].concat(results)
      recipe = this.e_.recipes.vintageimprovements
        .pressurizing(results, this.inputs_)
        .secondaryFluidOutput(0)
    } else {
      recipe = this.e_.recipes.vintageimprovements.pressurizing(
        results,
        this.inputs_
      )
    }
    if (this.heatRequirement_ !== null) {
      recipe.heatRequirement(this.heatRequirement_)
    }
    return recipe.processingTime(this.processingTime_)
  }
}
