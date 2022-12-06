<template>
  <div class="gamePage">
    <div class="logsDiv">
      <LogsBox></LogsBox>
    </div>
    <div class="gameDiv">
      <GameCanvas></GameCanvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GameCanvas from "@/components/GameCanvas.vue";
import LogsBox from "@/components/LogsBox.vue";

@Component({
  components: {
    GameCanvas,
    LogsBox,
  },
})
export default class GameView extends Vue {}
</script>

<style scoped lang="scss">
.gamePage {
  background-color: #fbfbea;
}
.logsDiv {
  position: absolute;
  right: 0;
  left: auto;
  margin: 5% 10% 0 0;
  z-index: 2 !important;
}

.gameDiv {
  z-index: 1 !important;
}
</style>
