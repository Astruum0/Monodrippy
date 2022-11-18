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

function randint(min: number, max: number) : number{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

const cornersCoords = [
    {x: 117, y: 117},
    {x: -117, y: 117},
    {x: -117, y: -117},
    {x: 117, y: -117},
]

var boardImg: P5Image
var bgImg: P5Image
var pawnModel: P5Geometry

var currentBoard: Board

const boardSize = 300

var pawnCase = 0;
var pawnCoords = new Vector(0, 0);

function convertCaseToCoords(caseNumber: number): P5Vector {
    const side = Math.floor(pawnCase / 9)
    const positionRelativeToSide = pawnCase % 9
    const coords = new Vector(cornersCoords[side].x, cornersCoords[side].y); 
    
    const extraCoords = positionRelativeToSide * 26
    if (side === 0) { 
        coords.x -= extraCoords 
    } else if (side === 1) { 
        coords.y -= extraCoords 
    } else if (side === 2) {
        coords.x += extraCoords 
    } else {
        coords.y += extraCoords
    }


    return coords
}

export default Vue.extend({
components: { P5 },
methods: {
    setup(sketch: P5Sketch) {

        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        sketch.background(20);

        getBoard(1).then(res => currentBoard = res)

        boardImg = sketch.loadImage("Board3D.png")
        pawnModel = sketch.loadModel("PawnLowPoly.obj")
        bgImg = sketch.loadImage("bg.jpg")
        sketch.normalMaterial()

        sketch.windowResized = function() {
            sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight)
        }
        sketch.keyPressed = function() {
            if (sketch.key === " ") {pawnCase = (pawnCase + 1) % 36}
        }


        
        
    },
    draw(sketch: P5Sketch) {
        
        sketch.background(251, 251, 234)

        sketch.orbitControl(2, 2, 0.02);

        sketch.push()
        sketch.translate(0, 2.5, 0)
        sketch.texture(bgImg)
        sketch.box(boardSize, 5, boardSize)
        sketch.pop()
        
        sketch.push()
        sketch.rotateX(sketch.PI/2)
        sketch.translate(0, 0, 0.01)
        sketch.texture(boardImg)
        sketch.rect(-150, -150, 300, 300)
        sketch.pop()

        sketch.push()
        sketch.fill(255, 192, 203)
        sketch.translate(pawnCoords.x, 0, pawnCoords.y);
        sketch.scale(5)
        sketch.rotateZ(sketch.PI)
        sketch.model(pawnModel)
        sketch.pop()

        pawnCoords = convertCaseToCoords(pawnCase);
    }
},
});
</script>