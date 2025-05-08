# Changelog
Use `git log --format='format:%s' {version}..HEAD | tac` to generate.


## v1.0.7

### New Mods / Major Changes
- Removed Corpse mod.
- Add SmarterContraptionStorage mod.

### Tweaks and Adustments
- Slightly simplify the recipe for blank circuits in Chapter 5a.
- Add a recipe for Quark's weird storage crate and show it in JEI.
- Add a script to set keepInventory gamerule to true and disable death waypoints
  by default.
- Change cascading archwood sap to yield molten lapis as byproduct.

### Bugfixes
- Correctly set all TPG cooling recipes to be exothermic.
- Fix a typo in Create: Vintage Improvement's Compressor JEI category tooltip.
- Fix minor typo in Ultimine QoL quest.
- Fix the silver plate quest requirement in Chapter 5a.
- Fix a typo in sawdust smoking/smelting recipe.
- Refactor removed fluids logic so recipes for removed fluids are disabled as
  well. Fixes bugs where removed fluids can still be accessed via hidden
  recipes.


## v1.0.6

### New Mods / Major Changes
- Add Amendments v1.2.19 and update Moonlight lib to v2.13.82
- Update main menu resource pack to v1.0.1 with GitHub logo on title screen.
- Add AdvancementJS and remove all advancements from the game.

### Tweaks and Adustments
- Make primary and secondary metal melting in a compacting basin. Alloying is
  always done by mixer now. Ceramic ingot casts will always break.
- Add a custom pause screen with an alternate button layout.
- Remove beacons and totems of undying from wandering villager trades.
- Add a milling recipe for coal coke.

### Bugfixes
- Register Create: Crafts & Additions Liquid Blaze Burner to as a PNCR heat
  source.
- Fix incorrect temperatures in some cooling recipes, change some heat frame
  recipes to TPP recipes to fix broken fluid tags.


## v1.0.5

### New Mods / Major Changes
- Update Apotheosis to v7.4.7 to fix a crash in the anvil menu.
- Update Bonemeal Config to v1.0.1 to fix cacti and shit growing through blocks.

### Tweaks and Adjustments
- Remove Create: Things and Misc Blaze Ballon
- Remove imbuement recipes for lesser ars foci.
- Remove disabled items from trades and additional loot.

### Bugfixes
- Fix typo in create stone crushing, refactor for better readability.
- Remove block swap mod, remove disabled items from IDAS structures.
- Fix enchanted sourceberry juicing to work properly in a compacting basin.


## v1.0.4

### New Mods / Major Changes
- n/a

### Tweaks and Adustments
- Adjust corundum cluster growth percentages.
- Add a recipe for ruby and sapphire dust to corundum.
- Change Chapter 5b's Gem of Water to Sapphire, adjusting recipes and removing
  lapis dependencies.
- Remove all disabled items from loot chests automatically with LootJS.

### Bugfixes
- Nerf sap mixing recipes since Create basins can only have 3 liquids present at
  any given time. Refactor Chapter 5b scripts into separate files.
- Fix a bug where the Ars Gravity Block Crushing custom JEI category would not
  render properly if the ingredient was create:shadow_steel due to registry
  funkiness.
- Remove all blocks from jumbofurnaceable tag to disable jumbo furnace
  formation.
- Update Apotheosis to v7.4.6 and Create: Balanced Flight to v2.3.0 to fix
  creative flight potion bug.
- Remove unused thermal items, add recipes for beekeeper gear in thermal.


## v1.0.3

### New Mods / Major Changes
- Update ModernFix to v5.20.2.
- Update Moonlight Lib to v1.20-2.13.81 to fix an obscure crash with multiplayer
  worlds with LAN mods.

### Tweaks and Adustments
- Add a quest for the Scribe's table.
- Adjust quest text in chapter 3 for liquefied slag.
- Add create:goggles to JEI.

### Bugfixes
- Fix a typo in intermediate sequenced assembly item registration.
- Remove FTBQuestsOptimizer mod. This was causing quest completion to lag.


## v1.0.2

### New Mods / Major Changes
- Update FancyMenu to v3.4.6
- Separate out the main menu assets image assets into a separate texture pack
  and bundle it as a pack dependency through the Curseforge manifest.

### Tweaks and Adjustments
- Slight adjustment to steel screw recipe for ratios.
- Change ratios for ore processing recipes. Crushing all ores now has 0.75x
  yield to dust.
- Remove Thermal's Apatite and Cinnabar.
- Rename all Thermal's blends to dusts for internal consistency.
- Add Ars Gravity block crushing recipes for all plate crafting.
- Add Apotheotic coins to treasure net loot. Adjust fishing nets to also have a
  5% chance of breaking.
- Remove Vanadium ingots, ore, and items.
- Move all gem compacting recipes to their own JEI category.
- Refactor slag processing, make ore processing always yield molten slag
  instead. Change aluminum's rich slag dependency.
- Remove Create: New Age's stirling engine and nerf magnet recipe.

### Bugfixes
- Fix TFMG rebar missing the forge:rods/steel tag.
- Minor tag tweak for forge:dough.


## v1.0.1

### New Mods / Major Changes
- Update all FTB mods to latest version.
- Remove Create: Sweets & Treats. This is a slop mod.
- Update Create: Vintage Improvements to v0.2.0.3.
- Update Sophisticated Core to v1.2.23.902, Sophisticated Backpacks to v3.23.6.1211 to fix JEI crash.

### Tweaks and Adjustments
- Fix and rebalance all Pressurizing recipes to only accept single itemstack inputs.
- Remove Progression chapter, make chapters unlock immediate when previous is done.
- Add custom ponders to custom mechanics tag list.

### Bugfixes
- Reduce main menu frame count and rescale pngs to 1280x720, cuts down fma file from 255MB to 88MB.
- Force creative tab appends as a potential mitigation for Creative tab items not showing.
- Removed translation keys for unused sin potions.
- Add recipe IDs to custom mixing and compacting recipes for tracing in logs.
- Fix broken translation key for Apple Syrup and Liquid Slime.
- Reduce FTB Quests inventory check time from 20 ticks to 1t.
- Remove playtesting command, tooltip helper, and misc mod starting items.


## v1.0.0

### New Mods / Major Changes
- Added Easel Does It, Portfolio, and Blueprint mods for painting variety.
- Bundle Chaotix Apotheotic Tweaks and Create New Age Retexture resource pack.
- Update to kubejs-forge-2001.6.5-build.16 and rhino-forge-2001.2.3-build.10
- Update KubeJS Additions to v4.3.4 and refactor nutrient infusion to use
  .wrap() category creator after NPE bugfix.
- Add custom main menu with looping animation background.
- Update Xaero's Minimap to v25.2.0

### Tweaks and Adjustments
- Add a custom animated texture for the Codex Indestructia.
- Remove usages of #forge:sheets in recipes.
- Replace Vintage Improvements netherite sheet with Create Deco instance.
- Add recipes for all dyes to be broken down in a millstone/crusher.
- Add alternative pathway to red dye for Chapter 2b.
- Added tesseract crystal intermediary for beacon crafting.
- Modify the energized beacon crafting JEI recipes to only show valid energizing
  items for recipes.
- Improve all custom ponders with smoother transitions and setup animations,
  standardized delays and setup function calls.
- Add JEI information text for amethyst buds of all sizes.
- Add a custom ponder for the Ender Inhibitor.
- Add an energized beacon crafting recipe for refined radiance.
- Add alternative efficient recipes for Paint Kits.
- Add quests and overhaul recipes for Chapter 8.
- Nerf Tom's Simple Storage inventory connector ranges.
- Add the ability for the singularity to delete any block from the game.
- Add an alternative silicon solidification recipe for cooling fluid.
- Add a crafting recipe for end portal frames.
- Add a JEI information category for teleportation juice.
- Implement the item, sound, and base behavior for the uninspired and inspired
  sparks.
- Implemented custom sounds, item, and texture for Creative Remote.
- Add some additional QoL quest text, rewards, and recipes for Chapter 5b.
- Add a Mysterious Item Conversion JEI recipe category for the inspired spark.
- Add additional music disc recipes to Creative Mechanism.
- Add compat crushing recipes for basalz and blitz products.
- Remove and hide the encased fan freezing catalysts.
- Nerf energizing refined radiance, move wand of symmetry recipe to overhauls dir.
- Disable pneumaticcraft dungeon loot.
- Increase note block resonance crafting radius to 3.
- Add support to the Arcane Portal for eating paintings.
- Add recipe reward to arcane portal for essence of culture.
- Add essence of culture to creative mechanism recipe.
- Add an jei:information category for blaze milk.
- Add a custom ponder for the Chromatic Bop Stick.

### Bugfixes
- Fix extra colored pixels in Chromatic Bop-Stick texture.
- Fix typo in chromatic bop stick recipe.
- Fix a bug where ingot casts would be incorrectly rotated on belts and depots.


## v0.0.14-playtest

### New Mods / Major Changes
- Update JEI to v15.20.0.104 to fix incompatibility with AppleSkin.
- Update Xaero's Minimap to 24.5.0.

### Tweaks and Adjustments
- Added recipes and items for crafting Creative Storage components from Refined
  Storage/ExtraStorage.
- Add textures and recipes for Tri-Steel Plating, a prerequisite item for
  Creative Mechanisms.
- Add a mechanic to allow anima essence to spawn mobs when right clicked on the
  relevant block.
- Add some alternative recipes for blue ice, snow, and powdered snow.
- Turn ghast tear recipe into an energized beacon craft instead of a resonance
  craft.
- Remove levitation potion ingredient from quantum mechanisms.
- Add invar spring dependency to vibrational mechanisms.
- Disable Quark's food tooltip to avoid doubled tooltips with AppleSkin.
- Add a breaking sound when a diamond saw blade breaks.
- Overhaul vibrating table recipe and remove all small springs from
  JEI/crafting.
- Code health fixes and minor tweaks to make ponders higher quality. Increased
  text delay time for readability, improved fade in animations.
- Add a Ponder explaining the vanilla sculk mechanic.
- Refactor and get rid of all calls to Utils.server.runCommandSilent for sound
  playing code in favor of level.playSound.
- Add a pressure chamber alternative to gem upgrade crafting.
- Add a concrete dependency to logistics mechanisms and update pneumatic
  assembly platform recipes to require it.
- Remove TFMG Cement and overhaul concrete mixture recipe to make minecraft
  concrete.
- Add a custom Creative Upgrade Smithing Template.
- Improve note block resonance crafting to have the final craft use different
  particles and play a the Ars Nouveau enchanting completion noise.
- Remove control chip and pneumaticcraft drill bits from JEI.
- Add Dimension Card recipe with quantum mechanism.
- Add lathing recipe for hollow logs and sawdust recipe from planks. Tweak
  hollow log recipe to yield 3 sawdust.
- Remove the regular void steel crafting recipe.
- Disable spammy chapter completion toasts, add fluid buckets as optional tasks
  in fluid related quests.
- Implement Tom's Storage Paint Kit right clicking logic for sheep and blocks.
- Update Remy the Epicure to also drop his crafting components on death.
- Minor adjustments to aluminum dust, iron oxide, and dust textures.
- Add initial scripts and items for Pembi the Artist and painting crafting.
- Update textures for ender inhibitor, unstable singularity, and magnetic
  confinement unit.
- Remove Vintage Improvement's steel rod recipe.
- Make singularity crafting more energy intensive and add a tooltip to unstable
  singularities.
- Add an implement a new item, the Chromatic Bop-Stick, to drain chromatic fluid
  from colored sheep for Chromatic Compound Crafting.

### Bugfixes
- Fix a bug in parseTextFormat() that caused the first style to be applied onto
  all subsequent text.
- Update recipe catalyst registrations for all custom JEI categories to work
  with updated JEI version.
- Fix a bug in energized beacon crafting that made violet corundum crafting
  impossible.
- Fix quest titles that use a smart filter as a task prerequisite.
- Fix some enormously stupid typos that broke void conversion recipes. Fix a bug
  in void conversion that made stacks of items not convert correctly. Add a
  particle effect to void conversion.
- Disable Create's shadow steel in favor of custom void conversion.
- Disable Create's refined radiance recipe in favor of energizing recipe.
- Fix liquid bucket quest names.
- Fix bug in nbt data tooltip for paint kit.
- Fix typos in all ItemEvents.entityInteracted calls.
- Fix sound type and hitbox for ender inhibitor.
- Fix a bug with dragon's breath bottling that resulted in the right click
  action instantly bottling the dragon's breath.
- Add a custom honey droplet and edible brownie item to replace the broken one
  in Create: Sweets and Treats.


## v0.0.13-playtest

### New Mods / Major Changes
- Update PonderJS to v1.4.0 to include new custom entity render code to for
  beacon ponder.
- Updated Create Encased to v1.6.1-fix1 to fix the pipe ponder crash, removed
  tooltip warning.
- Added Chapter 7: Quantum Mechanisms. Added recipes for machines used by
  Quantum Mechanisms.

### Tweaks and Adjustments
- Remove XP Condenser intermediate item in favor of pressurizing recipe.
- Add a centrifuging recipe to revert thermite powder.
- Make arcane portal unbreakable. Adjust arcane portal to have no drops, fix
  quest to only require an observation instead of the block.
- Adjust fluid vessel recipe to match the regular create fluid tank recipe.
- Add logic for corundum clusters to be grown with crystal spouting. Add
  tooltips for corundum blocks.
- Add manual dyeing recipes for corundum blocks.
- Slightly adjust apotheosis material recipes.
- Add a pressure chamber recipe for echo shards.
- Add a burnable fluid recipe for TFMG Creosote oil
- Remove all optional quests to prevent chapter completion toast from appearing
  over and over. Disable toasts for - non-progression based chapters.
- Add quest for hardened glass and adjust chapter 6 quests with intermediate
  rewards.
- Minor adjustments to ingot cast models, allow for cardinal placement.
- Change Time Pouch recipe to a shaped craft instead of a sequenced assembly.
- Add the Codex Indestructia item to make items unbreakable.
- Exempt everlasting beef from nutrient infusion and add apotheosis enchanting
  recipe.

### Bugfixes
- Fix iron oxide smelting recipe.
- Remove homo file.
- Move model declarations to automatic model path for arcane portal.
- Increase world seed script priority, add an error message of beacon crafting
  recipes fail to parse.
- Fix a bug with worldSeed.js. ServerEvents.loaded only fires once during the
  initial world load.
- Add corundum cluster automation pathways and corundum block beacon crafting.
- Fix energized beacon crafting recipe to display multiple outputs correctly in
  JEI.
- Remove the unbreakable screwdriver and diamond saw blade items in favor of
  using an item crafted with the Codex - Indestructia


## v0.0.12-playtest

### New Mods / Major Changes
  - Added a placeholder and WIP Chapter 7.
  - Add Xaero's World Map mod.
  - Add Xaero's Minimap mod.
  - Removed Create: Teleporters.
  - Remove Chapter 5c and vastly simplify Redstone Mechanisms. Move complex
    signalum recipe to chapter 7.
  - Add Integrated Dungeons and Structure v1.10.1
  - Update JEI to latest version 15.8.0.16
  - Migrated all mod to curseforge.

### Tweaks and Adjustments
- Overhaul Void items from Create Utilities.
- Make etching acid quest require a bucket of etching acid.
- Add a graphic for ESM and note block resonance crafting.
- Move thermite recipe overhauls and adjust TFMG grenade recipes.
- Add items for iron oxide dust and aluminum dust and recipes for aluminum
  processing.
- Add qol recipe for cloud in a bottle artifact.
- Add overhaul for Graviton tubes.
- Adjust XP crystal recipe to use rosin instead.
- Add an energized beacon crafting recipe alternative for energized glowstone.
- Change loot and light level requirement of warden tendril seeds.
- Adjust hardened planks recipe to consume far more creosote oil.
- Add a pyrolyzer recipe for coal coking.
- Add alternative pathway via lightning strike to get magnetite blocks.
- Show Create Central Kitchen Dragon's breath in JEI.
- Adjust reinforced deepslate recipe to reward automation more.
- Make the Tom's Simple Storage connectors rotatable via the Create wrench.
- Make Tom's Simple Storage blocks wrenchable.
- Overhaul void steel and void steel sheet recipes.
- Fix scaling of automated salvaging recipes. Add back manual salvaging recipes.
- Tweak coke oven recipe to yield 9 ovens.
- Implement custom JEI category for Void Steel gravity crushing.
- Adjust sourceberry recipe to yield slightly more source.

### Bugfixes
- Fix multiple bugs with the custom experience crystal where it wouldn't
  correctly level the player and allowed a filled crystal to dupe XP.
- Disable ash drops from mobs.
- Remove faulty blaze milk drinking code and add teleportation juice fluid.
- Fix typo in toms storage tooltip.
- Fix error in invocation of parseTextFormat
- Add note block quest reward to chapter 6
- Add intermediate item for gem slates to fix conflicting sequenced assembly
  recipes.
- Fix electrical connector recipe conflicts by adding an intermediate item for
  spool crafting and removing common end sequence step from electrical
  connectors.
- Fix Chapter 5A's oil bucket quest requirement.
- Change green dye recipe to kelp crushing since blasting recipes don't work.
- Remove broken recipes for raw dough compacting.
- Disable mixin.perf.dynamic_resources modern fix setting since it breaks
  Refined Storage's cable covers.


## v0.0.11-playtest

### New Mods / Major Updates
- Add Bonemeal Config mod v1.0.0.
- Update Apotheosis to v7.4.0.
- Change Apotheosis overhauls to match the new sigils added in v7.4.0.
- Update Create: Vintage Improvements to v0.1.6.0.
- Update Create: Connected to v0.8.2.
- Update Artifacts to v9.5.11.
- Update Curios API to v5.9.1+.
- Update Create: Copycats to v1.3.8+.
- Disable item optimization from APTweaks: Items.
- Add ponders explaining the Ars Nouveau blocks.
- Fully implement energized beacon crafting with energy carrier items and
  recipe processing.
- Change all references of andesite mechanism to kinetic mechanism.

### Tweaks and Adjustments
- Add recipes for unobtainable sculk blocks.
- Add a recipe alternative for yeast culture and fermented spider eye.
- Add an energizing recipe for hearthstones.
- Add recipes for reinforced deepslate and make it mineable and accessible with
  diamond tools.
- Add a recipe for Thermal's hardened glass.
- Integrate new laser machine from Create: Vintage Improvements.
- Adjust coke oven recipe output yield.
- Adjust Create: Slice and Dice bonemealing cost.
- Adjust looped crystal growth recipes to use a single step instead.
- Adjust obsidian overhaul to make obsidian dust easier to obtain. Add more
  pathways to get obsidian.
- Adjust dough recipes to yield more and be more forgiving.
- Adjust SequencedAssembly filling recipe to single filling recipe for amethyst
  buds.
- Adjust wooden hand replacement overhaul.
- Create a custom graphic to add to the metallurgy chapter.
- Prevent the Ender Dragon, Wither, and Warden from being captured by the Ritual
  of Containment.
- Remove the code to screw the player.
- Re-enable TFMG aluminum recipes, remove flarestack from JEI.
- Change source relay warper to require quantum mechanisms.

### Bugfixes
- Add Unbreakable tag to unbreakable items so they don't get consumed by crafts.
- Add IDs to thermal crystallizer recipes and fixed a recipe typo in lapis
  crystallization.
- Fix broken infused dragon's breath recipe.
- Hide all colored Refined Storage blocks from JEI, minor recipe tweak.
- Add a copy of the Refined Storage config to defaultconfigs/
- Fix a typo in Refined Storage's recipe overhauls.


## v0.0.10-playtest

### New Mods / Major Updates
- Add the Crafting Station mod.
- Add the Eccentric Tome mod.
- Overhauled copper circuit quest branch in Chapter 5a and moved it into its own
  dedicated chapter. It is now Chapter 5c: Redstone Mechanisms.
- Implemented void conversion mechanic from Create for Void Steel and other
  crafts.
- Implemented a block crushing mechanic with the Gravity spell from Ars Nouveau.

### Tweaks and Adjustments
- Add a crushing recipe for basalt to cobblestone.
- Add convenience recipes for vertical gearbox conversion.
- Add an Ars enchanting recipe to make Nutrient Infusion obtainable.
- Allow for trapdoors and drawers to be picked up with the Create wrench.
- Adjust the belt grinder speed thresholds. <64 RPM is low speed, <128 RPM is
  medium speed and any higher is high speed.
- Adjust fluid drawers to require the Create fluid tank.
- Remove worldgen for Thorium Ore from Create: New Age
- Adjust blaze powder and blaze rod conversion recipes.
- Adjust steel plate recipe to no longer require the helve hammer.
- Adjust steel screw recipe and add a lathe recipe with better yield.
- Removed uses of Thermal's Centrifugal Separator.
- Adjust some of the custom sequenced assembly recipes to require less custom
  steps and not clog JEI.
- Adjust the quests in Chapter 3 for clarity.
- Adjust the recipes for the Ars fruits to be easier to automate.
- Re-enable Create: Casing's custom mixers.
- Remove the regular crafting recipe for Create: Connected's sequenced pulse
  generator.
- Rename chapter 6a to chapter 7, and 6b to 6, clarifying the progression flow.
- Adjust Dragon's Breath bottling mechanic to require a Potion of Regeneration
  II.
- Remove TFMG's slag in favor of Thermal's slag item.
- Remove TFMG's turbine blade.
- Finish Thermal's machine overhaul. Only the chiller, refinery, pyrolyzer,
  crystallizer, and crafter are enabled.
- Minor fixes to overhauled tooltips.

### Bugfixes
- Fixed a bug where quartz blocks melt into 810 molten quartz instead of 360,
  allowing it to be duped.
- Fixed a bug where dough could not be cycled from haunting into eggs.
- Removed duplicated recipes for time pouch crafting.
- Fixed a bug where destabilized redstone, energized glowstone, and resonant
  ender were included in the total fluid output of their molten alloy.
- Fixed broken pressurizing recipes in Create Vintage Improvements after mod
  update.
- Fixed impossible alloying recipes that had 3 fluid inputs by changing them
  to pressurizing recipes.
- Fixed a typo in the cobweb crafting recipe.
- Fixed a duplicated recipe for Create's crushing wheels.


## v0.0.9-playtest

### New Mods / Major Updates
- Added Embeddium, APTweaks, FerriteCore, ModernFix and several other
  performance enhancing mods.
- Add Create: Molten Vents mod for ore processing line.
- Add Create: Encased mod for aesthetic casings, overhauled to fit within
  mechanism recipes.
- Implement 3 tiers of ore processing and a metallurgy chapter.
- Standardize all ore processing and melting recipes and organize hierarchy of
  ores and materials.

### Tweaks and Adjustments
- Added custom textures for dirty metal dusts, steel dust, and zinc dust.
- Add a recipe for rubberwood to be centrifuged.
- Update quest text for tuff from playtester feedback, move around sleeping bag
  rewards for QoL quests.
- Added a script to allow some vanilla blocks to be rotated with the Create
  wrench.
- Added a custom ponder for note block resonance crafting.
- Grouped all ponders into custom modpack index category.
- Integrated new lathe machine from Create Vintage Improvements and overhaul
  some recipes to use it (gears, rods, etc).
- Overhaul recipes for Create Armory to work with chapter progression.
- Reorganized JEI category sort order for all Create mods.
- Implemented a new crafting mechanic using Ars Nouveau's gravity spell to
  crush blocks.
- Buff the output of the clay processing recipe in Chapter 3.
- Add a deployer recipe for unfired clay ingot casts.
- Separate out redstone module quest to chapter 5c.

### Bugfixes
- Fixed a bug where steel plates were inaccessible due to requiring steel to
  make the helve hammer.
- Fixed a typo in recipe overhauls that broke the recipes for steam engines and
  smart chutes.
- Fixed Create Vintage Improvement's curving press recipes being broken when
  they share a common starting ingredient.


## v0.0.8-playtest

- Updated Forge to 47.3.0
- Fix missing ingot tags, fix broken quests for cobblestone melting
- Wrote and finished chapter quest content for Chapter 6b.
- Move around quest rewards and requirements from playtesting feedback.
- Add PacketFixer mod.
- Integrated custom textures from artist commission.
- Nerf Apotheosis garden module for max plant heights


## v0.0.7-playtest

- Integrated Create: Vintage Improvements mod.
- More custom JEI recipe categories and mechanic explainers.
- Fully integrated RecipeSchema code support.


## v0.0.6-playtest

- QOL Improvements
- Custom JEI categories and Ponders for custom mechanics.


## v0.0.5-playtest

- Overhauled metallurgy with custom metal casting molds.
