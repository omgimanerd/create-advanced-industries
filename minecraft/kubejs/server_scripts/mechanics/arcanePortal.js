// priority: 100
// Defines the logic for opening and sacrificing items/traders to the Arcane
// Portal in Chapter 5b and automating essences of culture for Chapter 8.

/**
 * Handles opening the Arcane Portal for hearthstone automation.
 */
BlockEvents.rightClicked('minecraft:crying_obsidian', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'ars_nouveau:source_gem') return
  block.spawnLightning(true)
  block.set('kubejs:arcane_portal')
  spawnParticles(level, 'minecraft:enchant', block.pos.center, 0.3, 100, 1)
})

/**
 * Checks if a pickaxe sacrified to the Arcane Portal is valid.
 * @param {Internal.ItemStack_} item
 * @returns {boolean}
 */
const checkPortalPickaxeSacrifice = (item) => {
  if (item.id !== 'minecraft:iron_pickaxe') return false
  if (item.isDamaged()) return false
  const displayElement = item.getTagElement('display')
  if (displayElement === null) return false
  if (displayElement.get('Name') !== '{"text":"Laborer\'s Pickaxe"}')
    return false
  if (!item.hasEnchantment('minecraft:efficiency', 3)) return false
  if (!item.hasEnchantment('minecraft:unbreaking', 3)) return false
  return true
}

/**
 * Checks if a written book sacrified to the Arcane Portal is valid.
 * @param {Internal.ItemStack_} item
 * @returns {boolean}
 */
const checkWrittenBookSacrifice = (item) => {
  if (item.id !== 'minecraft:written_book') return false
  if (item.nbt.title !== 'Literary Masterpiece') return false
  if (item.nbt.author !== 'omgimanerd') return false
  if (!item.nbt.resolved) return false
  return true
}

/**
 * Checks if a painting sacrified to the Arcane Portal is valid.
 */
const checkPaintingSacrifice = (item) => {
  if (item.id !== 'minecraft:painting') return false
  if (item.nbt?.EntityTag?.variant === undefined) return false
  return true
}

/**
 * Checks if an item sacrified to the Arcane Portal is a music disc.
 * @param {Internal.ItemEntity_} entity
 */

/**
 * Helper to discard the given entity, play a sound, and spawn particles when
 * the entity is a valid entity to be consumed by the Arcane Portal
 * @param {Internal.Entity_} entity
 */
const vanishValidEntity = (entity) => {
  entity.discard()
  entity.playSound(
    'minecraft:entity.enderman.teleport',
    /*volume=*/ 2,
    /*pitch=*/ 1
  )
  spawnParticles(
    entity.level,
    'minecraft:enchant',
    entity,
    0.15, // v
    75, // count
    0.1 // speed
  )
}

/**
 * @constructor
 * JS class to encapsulate the logic for processing the entity ticking logic
 * of the arcane portal.
 *
 * @param {Internal.BlockEntityJS_} e
 */
function ArcanePortalHandler(e) {
  this.e_ = e
  this.block_ = e.block
  this.pos_ = e.blockPos
  this.entity_ = this.block_.entity
  this.pdata_ = this.entity_.persistentData
  this.level_ = e.level
  this.server_ = e.level.server

  // Keys for the block entity's persistent data and the type to use for its
  // CompoundTag accessor. Uses reflection to unpack the keys and values in the
  // persistent data into this class.
  ArcanePortalHandler.PDATA_KEYS = Object.entries({
    // Used in Chapter 5b to automate hearthstones.
    laborersEaten_: 'Int',
    pickaxesEaten_: 'Int',

    // Used in Chapter 8 to automate Essences of Culture.
    musicDiscsEaten_: 'Int',
    booksEaten_: 'Int',
    paintingsEaten_: 'Int',

    // Records the tick time when the portal will next consume a surrounding
    // source fluid block.
    nextEatTime_: 'Long',
    // The accumulated instability when there is insufficient source fluid
    // around the portal.
    instability_: 'Int',
  })

  /**
   * Call before processing to unpack the persistent data keys into this class.
   */
  this.unpackPData = () => {
    ArcanePortalHandler.PDATA_KEYS.forEach((entry) => {
      const [field, type] = entry
      if (this[field] !== undefined && this[field] !== null) {
        throw new Error(
          `this.${field} already exists in object as ${this[field]}`
        )
      }
      // Insane reflection hack
      this[field] = this.pdata_[`get${type}`].call(this.pdata_, field)
    })
  }

  /**
   * Call at the end of processing to write the persistent data keys back into
   * the underlying object's persistent data object.
   */
  this.repackPData = () => {
    ArcanePortalHandler.PDATA_KEYS.forEach((entry) => {
      const [field, type] = entry
      if (this[field] === undefined || this[field] === null) {
        return
      }
      // Insane reflection hack
      this.pdata_[`put${type}`].call(this.pdata_, field, this[field])
    })
  }

  /**
   * Processes the entities near the arcane portal, eating them if they are
   * valid entities.
   */
  this.processNearbyEntities = () => {
    const entities = this.level_.getEntitiesWithin(
      AABB.ofBlocks(this.pos_.offset(-1, -1, -1), this.pos_.offset(1, 2, 1))
    )
    for (const /** @type {Internal.Entity_} */ entity of entities) {
      // Process a wandering trader.
      if (entity.type === 'minecraft:wandering_trader') {
        entity.discard()
        entity.playSound(
          'minecraft:entity.enderman.teleport',
          /*volume=*/ 2,
          /*pitch=*/ 1
        )
        this.laborersEaten_ = Math.min(5, this.laborersEaten_ + 1)
        spawnParticles(
          this.level_,
          'minecraft:enchant',
          entity.position().add(0, 2, 0),
          0.15, // v
          75, // count
          0.1 // speed
        )
        continue
      }

      // Process dropped item entities near the portal.
      let item = /** @type {net.minecraft.world.item.ItemStack} */ entity.item
      if (!item) continue

      // Laborer's pickaxes, for Chapter 5b
      if (checkPortalPickaxeSacrifice(item)) {
        this.pickaxesEaten_ = Math.min(5, this.pickaxesEaten_ + 1)
        vanishValidEntity(entity)
        continue
      }

      // Written books, for Chapter 8
      if (checkWrittenBookSacrifice(item)) {
        this.booksEaten_ = Math.min(10, this.booksEaten_ + 1)
        vanishValidEntity(entity)
        continue
      }

      // Paintings, for Chapter 8
      if (checkPaintingSacrifice(item)) {
        this.paintingsEaten_ = Math.min(10, this.paintingsEaten_ + 1)
        vanishValidEntity(entity)
        continue
      }

      // Music Discs, for Chapter 8
      if (item.hasTag('minecraft:music_discs')) {
        this.musicDiscsEaten_ = Math.min(10, this.musicDiscsEaten_ + 1)
        vanishValidEntity(entity)
        continue
      }

      // All other items have floating particles displayed around them.
      spawnParticles(
        this.level_,
        'minecraft:poof',
        entity.pos,
        0.1, // v
        3, // count
        0.01 // speed
      )
    }
  }

  /**
   * Handles the satisfaction of the arcane portal block, which will result in
   * certain output items being spawned.
   */
  this.processSatisfaction = () => {
    // If the portal is satisfied, a hearthstone is spawned in 100 ticks
    if (this.laborersEaten_ > 0 && this.pickaxesEaten_ > 0) {
      this.laborersEaten_--
      this.pickaxesEaten_--
      this.server_.scheduleInTicks(50, () => {
        this.level_.playSound(
          null, // player
          this.pos_.x,
          this.pos_.y,
          this.pos_.z,
          'minecraft:block.amethyst_block.step',
          'blocks',
          2, // volume
          1 // pitch
        )
        this.block_.popItemFromFace('gag:hearthstone', 'up')
      })
    }
  }

  /**
   * Processes the surrounding blocks to see if there is enough source fluid
   * to sustain the portal, consuming a source fluid block every now and then.
   */
  this.processConsumption = () => {
    // Eat surrounding fluid source blocks to sustain the portal.
    let surrounding = [
      this.block_.north,
      this.block_.south,
      this.block_.east,
      this.block_.west,
    ].filter((b) => {
      return b.id === 'starbunclemania:source_fluid_block'
    })
    // The next time the arcane portal needs to consume a liquefied source block
    // is stored as the tick count
    const currentTime = this.server_.getTickCount()
    // The first time the arcane portal block is created
    if (this.nextEatTime_ === 0) {
      this.nextEatTime_ = currentTime + randRangeInt(200, 400)
      // If there are
    } else if (currentTime >= this.nextEatTime_ && surrounding.length > 0) {
      /** @type {Internal.BlockContainerJS_} */
      let eatLocation = choice(surrounding)
      spawnParticles(
        this.level_,
        'minecraft:enchant',
        eatLocation.pos.center,
        0.15, // v
        75, // count
        0.1 // speed
      )
      eatLocation.set('minecraft:air')
      this.nextEatTime_ = currentTime + randRangeInt(200, 400)
    }

    // The portal becomes unstable if not surrounded by fluid source, and will
    // break if the instability gets too high.
    if (surrounding.length !== 4) {
      this.instability_ += 4 - surrounding.length
      spawnParticles(
        this.level_,
        'minecraft:campfire_cosy_smoke',
        blockPos.center.add(0, 1, 0),
        0,
        Math.ceil(this.instability_ / 4),
        0.01
      )
    } else {
      this.instability_ = 0
    }
    if (randRange(100) < this.instability_) {
      level.destroyBlock(block, false)
      block.createExplosion().causesFire(false).strength(1).explode()
    }
  }

  this.run = () => {
    this.unpackPData()
    this.processNearbyEntities()
    this.processSatisfaction()
    this.processConsumption()
    this.repackPData()
  }
}

/**
 * Block entity defined in startup_scripts/blocks.js
 * Callback defined here to allow for server side reload
 * @type {Internal.BlockEntityCallback_}
 * @param {Internal.BlockEntityJS_} e
 */
global.PortalBlockTickingCallback = (e) => {
  new ArcanePortalHandler(e).run()
}
