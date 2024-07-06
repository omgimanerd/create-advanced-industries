# Changelog

## v0.0.10-playtest

### New Mods / Major Updates
- Add the Crafting Station mod.
- Add the Eccentric Tome mod.
- Overhauled copper circuit quest branch in Chapter 5a and moved it into its own
  dedicated chapter. It is now Chapter 5c: Redstone Mechanisms.
- Implemented void conversion mechanic from Create for Void Steel and other
  crafts.
- Implemented a block crushing mechanic with the Gravity spell from Ars Nouveau.

### Tweaks and Changes
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

### Tweaks and Changes
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
- Added WIP Chapter 6 content