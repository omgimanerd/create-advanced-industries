// priority: 100
// Recipe overhauls for Chapter 6 progression.

/**
 * @param {string} jsonFilename
 * @returns
 */
const getGemId = (jsonFilename) => {
  return jsonFilename.replace('gems/', '').replace(/\.json$/, '')
}

let apotheoticGems = []

ServerEvents.highPriorityData((e) => {
  let apotheosisGemData = global.readJsonFolderFromMod(
    'data',
    'apotheosis',
    'gems'
  )
  let apotheoticAdditionsGemData = global.readJsonFolderFromMod(
    'data',
    'apotheotic_additions',
    'gems'
  )
  let mergedJson = Object.assign(
    {},
    JSON.parse(JsonIO.toString(apotheosisGemData)),
    JSON.parse(JsonIO.toString(apotheoticAdditionsGemData))
  )

  for (const [k, v] of Object.entries(mergedJson)) {
    if (!v.conditions) {
      apotheoticGems.push(getGemId(k))
      continue
    }
    let allModsLoaded = true
    for (const x of v.conditions) {
      if (x.type === 'forge:mod_loaded') {
        allModsLoaded &= Platform.isLoaded(x.modid)
      }
    }
    if (allModsLoaded) apotheoticGems.push(getGemId(k))
  }
})

ServerEvents.recipes((e) => {
  console.log(apotheoticGems)
  // common
  // uncommon
  // rare
  // epic
  // mythic
  // ancient

  // require going to end
  // apotheotic automation
  // ender transmission end automation
  // enderium?
})
