<template>
    <GameCanvas></GameCanvas>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GameCanvas from '@/components/GameCanvas.vue';

@Component({
components: {
    GameCanvas,
},
})
export default class GameView extends Vue {}
</script>