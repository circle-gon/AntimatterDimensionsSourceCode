<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "SpeedrunModeModal",
  components: {
    PrimaryButton,
    ModalCloseButton,
  },
  data() {
    return {
      onInfoPage: true,
      name: "",
      confirmPhrase: "",
    };
  },
  computed: {
    willStartRun() {
      return this.confirmPhrase === "Gotta Go Fast!";
    },
  },
  methods: {
    nextPage() {
      this.onInfoPage = false;
    },
    cancel() {
      this.emitClose();
    },
    startRun() {
      if (!this.willStartRun) return;
      this.emitClose();
      Speedrun.prepareSave(Speedrun.generateName(this.name));
    },
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <ModalCloseButton @click="cancel" />
    <h3>Entering Speedrun Mode</h3>
    <div
      v-if="onInfoPage"
      class="c-modal-message__text"
    >
      This will start a save with additional statistics tracking for when you reach certain points of
      the game. These will be visible in the bottom-right of the screen and on a dedicated subtab of Statistics.
      <br>
      <br>
      All animations and confirmations are disabled by default. When you start the run, the game remains paused until
      your antimatter changes, allowing you to configure all your settings before starting the run. Because of this,
      "Fake News" is given immediately instead of forcing you to wait.
      <br>
      <br>
      <i>
        There is no additional content in Speedrun Mode.
      </i>
      <br>
      <br>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
        @click="nextPage"
      >
        Continue
      </PrimaryButton>
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      You can type in text below to name your speedrun save. This will have no effects on gameplay and only identifies
      this particular save as yours. If no name is given, a random name will be generated instead. This name can be
      changed by clicking your name in the speedrun info box, as long as the timer has not started yet.
      <input
        ref="name"
        v-model="name"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="cancel"
      >
      <br>
      <br>
      Speedrun saves can be imported and exported like regular saves. Importing a speedrun save will mark it as a
      Segmented run, as importing and exporting allows for optimization of individual segments of the game.
      Without importing, saves will remain as Single-segment runs.
      <br>
      <br>
      <div class="c-modal-hard-reset-danger">
        Starting a speedrun will overwrite your current save, replacing this save with the new speedrun save. Export
        this save first if you want to keep a save with a beaten game. Type in "Gotta Go Fast!" below to confirm and
        start the run.
      </div>
      <input
        ref="confirmPhrase"
        v-model="confirmPhrase"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="cancel"
      >
      <PrimaryButton
        v-if="willStartRun"
        class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
        @click="startRun"
      >
        Start Run!
      </PrimaryButton>
      <PrimaryButton
        v-else
        class="o-primary-btn--width-medium c-modal-hard-reset-btn"
        @click="cancel"
      >
        Cancel
      </PrimaryButton>
    </div>
  </div>
</template>