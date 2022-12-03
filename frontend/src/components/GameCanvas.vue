<template>
    <div>
        <div class="turn-div">
            <p class="turn-info"></p>
            <button class="throw invisible" @click="throwDices">Throw Dices</button>
            <div class="dices-div invisible">
                <span class="dice-1">1</span>
                <span class="dice-2">1</span>
            </div>
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
    font-size: xx-large;

    /* vvvvv Unable to select text vvvvv */
    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */

}
.throw {
    font-weight: bold;
    background-color: papayawhip;
    font-size: large;
    padding: 5px;
}

.dices-div span {
    margin: 3px;
    font-size: x-large;
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
import { requestThrowDice } from "@/lib/requestThrowDice"
import { randint } from "@/lib/randomInt";

var loggedUser = {
    id: "edea9e9b-7b93-43dd-8517-5bb442d08bbe",
    name: "Astruum"
}
const boardId = 1

var currentBoard: Board
var history: Action[] = []
var nextAction: Action | undefined

var updateBoardTimeout: number

var turnInfoP: Element | null
var throwDicesButton: Element | null
var dicesDiv: Element | null
var dicesNumberDiv: (Element | null)[]

var rollingDices = true

export default Vue.extend({
components: { P5 },
methods: {
    throwDices() {
        const dices = [randint(1, 6), randint(1, 6)]
        rollingDices = false
        dicesNumberDiv[0]?.html(dices[0].toString())
        dicesNumberDiv[1]?.html(dices[1].toString())

        requestThrowDice(boardId, loggedUser.id, dices).then(res => {
            console.log(res);
        })
    },
    setup(sketch: P5Sketch) {

        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        sketch.background(20);
        turnInfoP = sketch.select(".turn-info")
        throwDicesButton = sketch.select(".throw")
        dicesDiv = sketch.select(".dices-div")
        dicesNumberDiv = [sketch.select(".dice-1"), sketch.select(".dice-2")]
        
        Board.boardImg = sketch.loadImage("Board3D.png")
        Board.boardBackground = sketch.loadImage("bg.jpg")
        Player.model = sketch.loadModel("PawnLowPoly.obj")
        
        updateBoardTimeout = setInterval(() => {
            getBoard(boardId).then(res => {
                if (currentBoard) {                    
                    updateBoard(currentBoard, res.board, history, res.history, () => {
                        currentBoard = res.board
                        nextAction = res.nextAction
                        const yourTurn = currentBoard.currentTurn === loggedUser.id
                        turnInfoP?.html(`It's ${yourTurn ? 'your' : currentBoard.getNextPlayer()?.name} turn`)
                        
                        if (yourTurn && nextAction?.description === "TURN") {
                            throwDicesButton?.removeClass("invisible")
                            dicesDiv?.removeClass("invisible")
                            rollingDices = true
                        } else {
                            throwDicesButton?.addClass("invisible")
                            dicesDiv?.addClass("invisible")
                        }
                        
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

        if (rollingDices && dicesNumberDiv.length > 0) {
            dicesNumberDiv[0]?.html(randint(1, 6).toString())
            dicesNumberDiv[1]?.html(randint(1, 6).toString())
        }
    }
},
});
</script>