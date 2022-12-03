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
    id: "edea9e9b-7b93-43dd-8517-5bb442d08bbe",
    name: "Astruum"
}

var currentBoard: Board
var history: Action[] = []
var nextAction: Action | undefined

var updateBoardTimeout: number

var turnInfoP: Element | null
var throwDicesButton: Element | null

export default Vue.extend({
components: { P5 },
methods: {
    setup(sketch: P5Sketch) {

        var id = this.getCookie("id_cookie")
        var pseudo = this.getCookie("pseudo_cookie")
        document.cookie = "pseudo_cookie" + "=" + "" ;
        document.cookie = "id_cookie" + "=" + "";        
        console.log(id)
        console.log(pseudo)

        var player = this.getPlayer(id, pseudo)
        console.log(player)

        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        sketch.background(20);
        turnInfoP = sketch.select(".turn-info")
        throwDicesButton = sketch.select(".throw")
        
        Board.boardImg = sketch.loadImage("Board3D.png")
        Board.boardBackground = sketch.loadImage("bg.jpg")
        Player.model = sketch.loadModel("PawnLowPoly.obj")
        
        updateBoardTimeout = setInterval(() => {
            getBoard(1).then(res => {
                if (currentBoard) {                    
                    updateBoard(currentBoard, res.board, history, res.history, () => {
                        currentBoard = res.board
                        
                        const yourTurn = currentBoard.currentTurn === loggedUser.id
                        turnInfoP?.html(`It's ${yourTurn ? 'your' : currentBoard.getNextPlayer()?.name} turn`)

                        if (yourTurn) {
                            throwDicesButton?.removeClass("invisible")
                        } else {
                            throwDicesButton?.addClass("invisible")
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
    getCookie(name: string) {
        var cookie_name = name + "=";
        var data = document.cookie.split(';');
        for (var i = 0; i < data.length; i++) {
            var c = data[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(cookie_name) == 0) {
                return c.substring(cookie_name.length, c.length);
            }
        }
    },
    getPlayer(id: any, pseudo: any) {
        const url = "http://localhost:3001/boards/join/" + id;

        const data = {
            pseudo
        }

        return fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
    },
    draw(sketch: P5Sketch) {
        
        sketch.background(251, 251, 234)

        sketch.orbitControl(2, 2, 0.02);

        currentBoard && currentBoard.draw(sketch)
    }
},
});
</script>