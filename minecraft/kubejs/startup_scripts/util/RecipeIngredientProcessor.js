// priority: 1001

/**
 * @constructor
 * @param {{string:number}} inputItems A dictionary of item IDs to counts,
 *   representing the pool of inputs currently available to process.
 */
function RecipeIngredientProcessor(inputItems) {
  this.inputItems = Object.assign({}, inputItems)
  this.outputItems = {}
}

/**
 * Static factory method for RecipeIngredientManager.
 * @param {Internal.Entity_[]} entities List of item entities to use as the
 * input items pool
 * @returns {RecipeIngredientProcessor}
 */
RecipeIngredientProcessor.fromItemEntities = function (entities) {
  const items = {}
  for (const entity of entities) {
    if (entity.item === undefined || entity.item.id === undefined) continue
    items[entity.item.id] = (items[entity.item.id] || 0) + entity.item.count
  }
  return new RecipeIngredientProcessor(items)
}

/**
 * Given an ingredients list and a results list, this attempts to perform the
 * craft as many times as possible with the internally stored pool of items.
 *
 * Mutates this.inputItems and stores the results in this.outputItems.
 *
 * @param {InputItem_[]} ingredients
 * @param {OutputItem_[]} results
 * @returns {boolean}
 */
RecipeIngredientProcessor.prototype.processIngredientList = function (
  ingredients,
  results
) {
  // Make a copy of the current pool of items we have and attempt to remove
  // the list of required ingredients from it. If it fails, then we do not
  // have the crafting prerequisites. If it succeeds, then store the output
  // and replace the pool of input items with this object.
  const inputItems = Object.assign({}, this.inputItems)

  let hasAllMatchingIngredients = true
  for (const ingredient of ingredients) {
    // ItemStack input
    let requiredCount = ingredient.count
    if (ingredient.id !== undefined && requiredCount !== undefined) {
      let inputItemCount = inputItems[ingredient.id]
      if (inputItemCount !== undefined && inputItemCount >= requiredCount) {
        inputItems[ingredient.id] = inputItemCount - requiredCount
      } else {
        hasAllMatchingIngredients = false
        break
      }
    }
    // Ingredient input
    //
    // Note that there is a bug here if a ingredient list with multiple item
    // tags is given. There is a possibility that a subset of input items exists
    // which satisfies the ingredient list, but since we are processing them
    // sequentially and not considering every possibility, the input items may
    // fail the match.
    if (ingredient.test !== undefined) {
      let requiredCount = ingredient.count || 1
      let ingredientInInputs = false
      // For a ingredient with a tag, we have to check it against every entry
      // in our item pool to look for a match.
      for (const [inputItem, inputItemCount] of Object.entries(inputItems)) {
        if (ingredient.test(inputItem) && inputItemCount >= requiredCount) {
          inputItems[inputItem] -= requiredCount
          ingredientInInputs = true
          break
        }
      }
      if (!ingredientInInputs) {
        hasAllMatchingIngredients = false
        break
      }
    }
  }

  // If we could not match the current list of ingredients to the items in our
  // input pool, stop and return a failure status.
  if (!hasAllMatchingIngredients) {
    return false
  }

  // Input processing complete, add the results to the result list and return
  // the success status.
  this.inputItems = inputItems
  for (const { id, count } of results) {
    this.outputItems[id] = (this.outputItems[id] || 0) + count
  }
  return true
}

/**
 * Takes all the remaining items in the input pool after processing and concats
 * it together with the recipe processing outputs. Returns a list of ItemStacks
 * that we can pop into the world.
 * @returns {Internal.ItemStack_}
 */
RecipeIngredientProcessor.prototype.getResultingItems = function () {
  const resultDict = this.outputItems
  for (const [item, count] of Object.entries(this.inputItems)) {
    if (count > 0) {
      resultDict[item] = (resultDict[item] || 0) + count
    }
  }
  const resultList = []
  for (let [item, count] of Object.entries(resultDict)) {
    let stackSize = Item.of(item).maxStackSize
    while (count > stackSize) {
      resultList.push(Item.of(item, stackSize))
      count -= stackSize
    }
    if (count > 0) {
      resultList.push(Item.of(item, count))
    }
  }
  return resultList
}

global.RecipeIngredientProcessor = RecipeIngredientProcessor
