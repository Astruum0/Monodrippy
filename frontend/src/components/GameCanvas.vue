<template>
    <div>
        <P5 v-on="{setup, draw}" />
    </div>
</template>

<style>
canvas {
    margin: 0;
    display: block;
    background-image: url("../assets/sky.jpg");
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>

<script lang="ts">
import Vue from "vue";
import
P5 from "./P5.vue";
import {P5Sketch, P5Image, P5Geometry, P5Vector} from "vue-p5-component";
import { Vector } from "p5";
import { Board } from "@/models/board";
import { getBoard } from "../lib/getGame"
import { Player } from "@/models/player";

function randint(min: number, max: number) : number{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}



var currentBoard: Board
export default Vue.extend({
components: { P5 },
methods: {
    setup(sketch: P5Sketch) {

        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        sketch.background(20);

        Board.boardImg = sketch.loadImage("Board3D.png")
        Board.boardBackground = sketch.loadImage("bg.jpg")
        Player.model = sketch.loadModel("PawnLowPoly.obj")
        

        getBoard(1).then(res => {currentBoard = res})

        sketch.normalMaterial()

        sketch.windowResized = function() {
            sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight)
        }
        sketch.keyPressed = function() {
            if (["0", "1", "2", "3"].includes(sketch.key.toString())) {
                currentBoard.players[parseInt(sketch.key)].moveTo((currentBoard.players[parseInt(sketch.key)].position + 1) % 36) 
            }
            if (sketch.key === " ") {
                currentBoard.players[0].moveTo(currentBoard.players[0].position + 35 % 36) 
            } 
        }
    },
    draw(sketch: P5Sketch) {
        
        sketch.background(251, 251, 234)

        sketch.orbitControl(2, 2, 0.02);

        currentBoard.draw(sketch)
    }
},
});
</script>