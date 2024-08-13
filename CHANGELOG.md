# Changelog

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
