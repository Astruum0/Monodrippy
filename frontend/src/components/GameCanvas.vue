<template>
    <div>
        <div class="turn-div">
            <p class="turn-info"></p>
            <button class="throw invisible">Throw Dices</button>
        </div>
        <P5 v-on="{setup, draw}" />
    </div>
</template>

<style>
.invisible {
    display: none;
}
.turn-div {
    font-weight: bold;
    font-size: xx-large;
    position: absolute;
    top: 90%;  
    left: 50%; 
    transform: translate(-50%, -50%);
    display: flex;

    justify-content: center;
    flex-direction: column;
}
.turn-info {    
    margin: 5px;

    /* vvvvv Unable to select text vvvvv */
    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */

}
.throw {
    font-weight: bold;
    background-color: papayawhip;
    padding: 10px;
}
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
import { Element, Vector } from "p5";
import { Board } from "@/models/board";
import { getBoard } from "../lib/getGame"
import { Player } from "@/models/player";
import { Action } from "@/models/game";
import { updateBoard } from "@/lib/updateBoard";

function randint(min: number, max: number) : number{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

var loggedUser = {
    id: "a5dad10f-e016-447d-bca7-18ab4eb0d31a",
    name: "Mattecum"
}

var currentBoard: Board
var history: Action[] = []
var nextAction: Action | undefined

var updateBoardTimeout: number

var turnInfoP: Element | null

export default Vue.extend({
components: { P5 },
methods: {
    setup(sketch: P5Sketch) {

        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        sketch.background(20);
        turnInfoP = sketch.select(".turn-info")
        
        Board.boardImg = sketch.loadImage("Board3D.png")
        Board.boardBackground = sketch.loadImage("bg.jpg")
        Player.model = sketch.loadModel("PawnLowPoly.obj")
        
        updateBoardTimeout = setInterval(() => {
            getBoard(1).then(res => {
                if (currentBoard) {                    
                    updateBoard(currentBoard, res.board, history, res.history, () => {
                        turnInfoP?.html(`It's ${currentBoard.currentTurn === loggedUser.id ? 'your' : currentBoard.getNextPlayer()?.name} turn`)
                        currentBoard = res.board
                        console.log(res.board);
                        
                    })
                    history = res.history

                    

                } else {
                    currentBoard = res.board
                }
                
                
        })

        }, 2000);
        
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

        currentBoard && currentBoard.draw(sketch)
    }
},
});
</script>