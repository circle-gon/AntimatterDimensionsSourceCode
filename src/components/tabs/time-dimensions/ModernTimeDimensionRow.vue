<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ModernTimeDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton,
  },
  props: {
    tier: {
      type: Number,
      required: true,
    },
    areAutobuyersUnlocked: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isAutobuyerOn: false,
      requirementReached: false,
      realityUnlocked: false,
      showTTCost: false,
      ttCost: 0,
      ttGen: new Decimal(),
      currTT: new Decimal(),
      isContinuumActive: false,
      continuumValue: 0,
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return `${TimeDimension(this.tier).shortDisplayName} Time Dimension`;
    },
    buttonContents() {
      if (this.showTTCost) {
        return this.formattedTTCost;
      }
      if (this.isContinuumActive) return `Continuum: ${this.continuumString}`;
      return this.formattedEPCost;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    tooltipContents() {
      if (this.showTTCost) return `${this.formattedEPCost}<br>${this.timeEstimate}`;
      if (this.isCapped) return `Nameless prevents the purchase of more than ${format(1)} Time Dimension`;
      if (this.isContinuumActive) return `Continuum produces all your Time Dimensions`;
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    showRow() {
      return this.realityUnlocked || this.isUnlocked || this.requirementReached;
    },
    formattedTTCost() {
      return `Unlock: ${format(this.ttCost)} TT`;
    },
    formattedEPCost() {
      return this.isCapped ? "Capped" : `${this.showCostTitle ? "Cost: " : ""}${format(this.cost, 2)} EP`;
    },
    hasLongText() {
      return this.buttonContents.length > 20;
    },
    showCostTitle() {
      return this.cost.exponent < 1e5;
    },
    timeEstimate() {
      if (!this.showTTCost || this.ttGen.eq(0)) return "";
      const time = Decimal.sub(this.ttCost, this.currTT).dividedBy(this.ttGen);
      return time.gt(0) ? `Enough TT in ${TimeSpan.fromSeconds(time.toNumber()).toStringShort()}` : "";
    },
    cssVars() {
      return {
        "--x-pos": this.isContinuumActive ? "-125%" : "-175%",
      };
    },
    buttonClass() {
      return {
        "l-dim-row-small-text": this.hasLongText && !this.isContinuumActive,
        "o-non-clickable o-continuum": this.isContinuumActive,
      };
    },
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.timeDimension(this.tier).isActive = newValue;
    },
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = TimeDimension(tier);
      this.isCapped = Enslaved.isRunning && dimension.bought > 0;
      this.isUnlocked = dimension.isUnlocked;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought = dimension.bought;
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      if (!this.isUnlocked) {
        this.isAvailableForPurchase = dimension.requirementReached;
      }
      this.requirementReached = dimension.requirementReached;
      this.isAutobuyerOn = Autobuyer.timeDimension(this.tier).isActive;
      this.realityUnlocked = PlayerProgress.realityUnlocked();
      this.showTTCost = !this.isUnlocked && !this.shiftDown;
      if (this.tier > 4) this.ttCost = TimeStudy.timeDimension(this.tier).cost;
      this.currTT.copyFrom(Currency.timeTheorems.value);
      this.ttGen.copyFrom(getTTPerSecond().times(getGameSpeedupFactor()));
      this.isContinuumActive = TimeDimensions.continuumActive;
      if (this.isContinuumActive) this.continuumValue = dimension.continuumValue;
    },
    buyTimeDimension() {
      if (!this.isUnlocked) {
        TimeDimension(this.tier).tryUnlock();
        return;
      }
      if (this.isContinuumActive) return;
      buySingleTimeDimension(this.tier);
    },
    buyMaxTimeDimension() {
      if (this.isContinuumActive) return;
      buyMaxTimeDimension(this.tier);
    },
  },
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-time-dim l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !requirementReached }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container" :style="cssVars">
      <div class="c-modern-dim-purchase-count-tooltip">
        <span v-html="tooltipContents" />
      </div>
      <PrimaryButton
        :enabled="isAvailableForPurchase && !isCapped && !isContinuumActive"
        class="o-primary-btn--buy-td o-primary-btn o-primary-btn--new o-primary-btn--buy-dim"
        :class="buttonClass"
        @click="buyTimeDimension"
      >
        {{ buttonContents }}
      </PrimaryButton>
      <template v-if="!isContinuumActive">
        <PrimaryToggleButton
          v-if="areAutobuyersUnlocked"
          v-model="isAutobuyerOn"
          class="o-primary-btn--buy-td-auto"
          label="Auto:"
        />
        <PrimaryButton
          v-else
          :enabled="isAvailableForPurchase && !isCapped"
          class="o-primary-btn--buy-td-auto"
          @click="buyMaxTimeDimension"
        >
          Buy Max
        </PrimaryButton>
      </template>
    </div>
  </div>
</template>

<style scoped>
.c-modern-dim-tooltip-container .c-modern-dim-purchase-count-tooltip {
  position: absolute;
  width: 20rem;
  top: 50%;
  font-size: 1.3rem;
  line-height: 1.6rem;
  color: white;
  background: black;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-width, 0.5rem);
  /* Buttons are 40rem wide, tooltip is 20rem */
  transform: translate(calc(var(--x-pos) - 1rem), -50%);
  padding: 0.5rem;
  visibility: hidden;
}

.o-continuum {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--accent);
  background: var(--color-laitela--base);
}
.o-continuum:hover {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--base);
  background: var(--color-laitela--accent);
}
</style>
