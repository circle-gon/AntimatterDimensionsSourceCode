<script>
export default {
  name: "SingularityPane",
  data() {
    return {
      darkEnergy: new Decimal(0),
      darkEnergyGainPerSecond: new Decimal(0),
      singularities: new Decimal(0),
      singularityCapIncreases: 0,
      canPerformSingularity: false,
      unlockedBulkSingularity: false,
      singularityCap: new Decimal(0),
      baseTimeToSingularity: 0,
      currentTimeToSingularity: 0,
      extraTimeAfterSingularity: 0,
      singularitiesGained: new Decimal(0),
      autoSingularityFactor: 0,
      perStepFactor: 0,
      isAutoEnabled: false,
      hasAutoSingularity: false,
      nextLowerStep: new Decimal(0),
      willCondenseOnDecrease: false,
      passiveSingularityGain: new Decimal(0),
      passiveSingularityUnlocked: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    singularityFormText() {
      const formText = this.singularitiesGained.eq(1)
        ? "all Dark Energy into a Singularity"
        : `all Dark Energy into ${quantify("Singularity", this.singularitiesGained, 2)}`;
      if (this.canPerformSingularity) {
        return `Condense ${formText}`;
      }
      return `Reach ${format(this.singularityCap)} Dark Energy to condense ${formText}`;
    },
    singularityWaitText() {
      let singularityTime = this.currentTimeToSingularity;
      if (this.canPerformSingularity) {
        singularityTime += this.extraTimeAfterSingularity;
        if (!this.isAutoEnabled) return "";
        return singularityTime > 0
          ? `(Auto-condensing in ${TimeSpan.fromSeconds(singularityTime).toStringShort()})`
          : "(Will immediately auto-condense)";
      }
      return `(Enough Dark Energy in ${TimeSpan.fromSeconds(singularityTime).toStringShort()})`;
    },
    baseSingularityTime() {
      return TimeSpan.fromSeconds(this.baseTimeToSingularity).toStringShort();
    },
    additionalSingularityTime() {
      return TimeSpan.fromSeconds(this.extraTimeAfterSingularity).toStringShort();
    },
    manualSingularityRate() {
      const totalTime = this.baseTimeToSingularity;
      return this.formatRate(this.singularitiesGained.div(totalTime));
    },
    autoSingularityRate() {
      if (this.hasAutoSingularity && !this.isAutoEnabled) return "Auto-Singularity is OFF";
      const totalTime = this.baseTimeToSingularity + this.extraTimeAfterSingularity;
      return this.formatRate(this.singularitiesGained.div(totalTime));
    },
    decreaseTooltip() {
      if (this.singularityCapIncreases === 0) return "You cannot decrease the cap any further!";
      const singularities = this.singularitiesGained.div(this.perStepFactor);
      return this.willCondenseOnDecrease
        ? `Decreasing the cap will immediately auto-condense for
          ${quantify("Singularity", singularities, 2)}!`
        : null;
    },
    increaseTooltip() {
      return this.singularityCapIncreases >= 50 ? "You cannot increase the cap any further!" : null;
    },
  },
  methods: {
    update() {
      const laitela = player.celestials.laitela;
      this.darkEnergy.copyFrom(Currency.darkEnergy.value);
      this.darkEnergyGainPerSecond = Currency.darkEnergy.productionPerSecond;
      this.singularities.copyFrom(Currency.singularities.value);
      this.singularityCapIncreases = laitela.singularityCapIncreases;
      this.canPerformSingularity = Singularity.capIsReached;
      this.unlockedBulkSingularity = Currency.singularities.gte(10);
      this.singularityCap = Singularity.cap;
      this.baseTimeToSingularity = Singularity.timePerCondense;
      this.currentTimeToSingularity = Singularity.timeUntilCap;
      this.extraTimeAfterSingularity = Singularity.timeDelayFromAuto;
      this.singularitiesGained = Singularity.singularitiesGained;
      this.autoSingularityFactor = SingularityMilestone.autoCondense.effectOrDefault(Infinity);
      this.perStepFactor = Singularity.gainPerCapIncrease;
      this.isAutoEnabled = player.auto.singularity.isActive && SingularityMilestone.autoCondense.canBeApplied;
      this.hasAutoSingularity = Number.isFinite(this.autoSingularityFactor);
      this.nextLowerStep = this.singularityCap.mul(this.autoSingularityFactor).div(10);
      this.willCondenseOnDecrease = this.isAutoEnabled && this.darkEnergy.gt(this.nextLowerStep);
      this.passiveSingularityGain = Singularity.passiveSingularityGain;
      this.passiveSingularityUnlocked = AtomUpgrade(8).isBought;
    },
    doSingularity() {
      Singularity.perform();
    },
    increaseCap() {
      Singularity.increaseCap();
    },
    decreaseCap() {
      Singularity.decreaseCap();
    },
    formatRate(rate) {
      if (rate.lt(1 / 60)) return `${format(rate.mul(3600), 2, 3)} per hour`;
      if (rate.lt(1)) return `${format(rate.mul(60), 2, 3)} per minute`;
      return `${format(rate, 2, 3)} per second`;
    },
    condenseClassObject() {
      return {
        "c-laitela-singularity": true,
        "c-laitela-singularity--active": this.canPerformSingularity && !this.isDoomed,
        "o-pelle-disabled": this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed,
      };
    },
  },
};
</script>

<template>
  <div class="c-laitela-singularity-container">
    <div>
      <h2>
        You have {{ quantify("Singularity", singularities, 2)
        }}{{ passiveSingularityUnlocked ? ` (+${format(passiveSingularityGain, 2, 0)}/sec)` : "" }}
      </h2>
      <button v-if="!passiveSingularityUnlocked" :class="condenseClassObject()" @click="doSingularity">
        <h2>
          {{ singularityFormText }}
        </h2>
        <br v-if="singularityWaitText !== ''" />
        <h2>
          {{ singularityWaitText }}
        </h2>
      </button>
    </div>
    <div v-if="singularities.neq(0)">
      <div class="o-laitela-matter-amount">
        You have {{ format(darkEnergy, 2, 4) }} Dark Energy. (+{{ format(darkEnergyGainPerSecond, 2, 4) }}/s)
      </div>
      <div v-if="unlockedBulkSingularity">
        <template v-if="!passiveSingularityUnlocked">
          <button
            class="c-laitela-singularity__cap-control"
            :class="{ 'c-laitela-singularity__cap-control--available': singularityCapIncreases > 0 }"
            :ach-tooltip="decreaseTooltip"
            @click="decreaseCap"
          >
            Decrease Singularity cap.
          </button>
          <button
            class="c-laitela-singularity__cap-control c-laitela-singularity__cap-control--available"
            :class="{ 'c-laitela-singularity__cap-control--available': singularityCapIncreases < 50 }"
            :ach-tooltip="increaseTooltip"
            @click="increaseCap"
          >
            Increase Singularity cap.
          </button>
          <br />
        </template>
        Each step increases the required Dark Energy by {{ formatX(10) }},
        <br />
        but also increases gained Singularities by {{ formatX(perStepFactor) }}.
      </div>
      <div v-else>
        <br />
        Reach {{ format(10) }} Singularities
        <br />
        to unlock Bulk Singularities.
        <br />
      </div>
      <br />
      <template v-if="!passiveSingularityUnlocked">
        Total time to <span v-if="hasAutoSingularity">(auto-)</span>condense:
        {{ baseSingularityTime }}
      </template>
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1"> (+{{ additionalSingularityTime }}) </span>
      <br />
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">Manual </span>
      <template v-if="!passiveSingularityUnlocked">
        Singularity gain rate: {{ manualSingularityRate }}
        <br />
      </template>
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">
        Automatic Singularity gain rate: {{ autoSingularityRate }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.c-laitela-singularity__cap-control {
  margin: 0 0.3rem 1rem;
}
</style>
