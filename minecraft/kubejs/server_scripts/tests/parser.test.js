// priority: 0
// Run by KubeJS on reload, outputs warnings on failure.

;(function () {
  const eq = (a, b) => {
    a = JSON.stringify(a)
    b = JSON.stringify(b)
    if (a !== b) {
      throw new Error(`Assertion failed: ${a} !== ${b}`)
    }
  }

  const error = (fn, t) => {
    try {
      fn()
      throw new Error(`${fn} did not throw error.`)
    } catch (e) {
      if (e.message !== t) {
        throw new Error(`Assertion failed: ${e} !== ${t}`)
      }
    }
  }

  console.log('----------------------------')
  console.log('RUNNING parser.js UNIT TESTS')
  console.log('----------------------------')

  eq(Parser.parseStackedItemInput('minecraft:oak_log'), {
    item: 'minecraft:oak_log',
  })
  eq(Parser.parseStackedItemInput('2x minecraft:oak_log'), {
    item: 'minecraft:oak_log',
    count: 2,
  })
  eq(Parser.parseStackedItemInput('#minecraft:logs'), {
    tag: 'minecraft:logs',
  })
  eq(Parser.parseStackedItemInput('3x #minecraft:logs'), {
    tag: 'minecraft:logs',
    count: 3,
  })
  eq(Parser.parseStackedItemInput(Item.of('minecraft:oak_log')), {
    item: 'minecraft:oak_log',
    count: 1,
  })
  eq(Parser.parseStackedItemInput(Item.of('minecraft:oak_log', 4)), {
    item: 'minecraft:oak_log',
    count: 4,
  })
  eq(
    Parser.parseStackedItemInput(
      Item.of('minecraft:enchanted_book').enchant('sharpness', 1)
    ),
    {
      item: 'minecraft:enchanted_book',
      count: 1,
      nbt: '{StoredEnchantments:[{id:"minecraft:sharpness",lvl:1s}]}',
    }
  )
  error(() => {
    Parser.parseStackedItemInput('asdfieh')
  }, 'Unable to parse item input: asdfieh')

  eq(Parser.parseItemInput('minecraft:oak_log'), {
    item: 'minecraft:oak_log',
  })
  eq(Parser.parseItemInput('#minecraft:logs'), {
    tag: 'minecraft:logs',
  })
  eq(Parser.parseItemInput(Item.of('minecraft:oak_log')), {
    item: 'minecraft:oak_log',
  })
  error(() => {
    Parser.parseItemInput('2x minecraft:oak_log')
  }, 'Single item input cannot have a quantity: 2x minecraft:oak_log')

  eq(Parser.parseItemOutput('minecraft:stone'), {
    item: 'minecraft:stone',
  })
  eq(Parser.parseItemOutput('2x minecraft:stone'), {
    item: 'minecraft:stone',
    count: 2,
  })
  eq(Parser.parseItemOutput(Item.of('minecraft:stone')), {
    item: 'minecraft:stone',
    count: 1,
  })
  eq(Parser.parseItemOutput(Item.of('minecraft:stone', 2)), {
    item: 'minecraft:stone',
    count: 2,
  })
  error(() => {
    Parser.parseItemOutput('#minecraft:stone')
  }, 'Output item cannot have a tag: #minecraft:stone')

  eq(
    Parser.parseItemOrFluidInputs([
      'minecraft:stone',
      '4x minecraft:oak_log',
      '20mb minecraft:water',
    ]),
    {
      items: [
        {
          item: 'minecraft:stone',
        },
        {
          item: 'minecraft:oak_log',
          count: 4,
        },
      ],
      fluids: [
        {
          amount: 20,
          fluid: 'minecraft:water',
        },
      ],
    }
  )

  let input = [
    'minecraft:stone',
    '2x minecraft:oak_log',
    '4x minecraft:oak_slab',
  ]
  error(() => {
    Parser.parseItemOrFluidInputs(input, { maxItems: 2 })
  }, `${input} exceeded 2 items`)
  input = [
    'minecraft:stone',
    '1000mb minecraft:water',
    '1500mb minecraft:lava',
    '200mb create:honey',
  ]
  error(() => {
    Parser.parseItemOrFluidInputs(input, { maxFluids: 2 })
  }, `${input} exceeded 2 fluids`)

  console.log('-------------------------------')
  console.log('ALL parser.js UNIT TESTS PASSED')
  console.log('-------------------------------')
})()
