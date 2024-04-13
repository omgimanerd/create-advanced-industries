// priority: 500

const definePneumaticcraftRecipes = (e) => {
  return {
    // Helpers
    /**
     * @param {string} input
     * @returns {Assembly}
     */
    Assembly: getConstructorWrapper(e, Assembly),
    /**
     * @param {string} input1
     * @param {string} input2
     * @returns {FluidMixer}
     */
    FluidMixer: getConstructorWrapper(e, FluidMixer),
    /**
     * @param {string} input
     * @returns {HeatFrame}
     */
    HeatFrame: getConstructorWrapper(e, HeatFrame),
    /**
     * @param {string|string[]} inputs
     * @returns {PressureChamber}
     */
    PressureChamber: getConstructorWrapper(e, PressureChamber),
    /**
     * @param {string|string[]} inputs
     * @returns {ThermoPlant}
     */
    ThermoPlant: getConstructorWrapper(e, ThermoPlant),
  }
}
