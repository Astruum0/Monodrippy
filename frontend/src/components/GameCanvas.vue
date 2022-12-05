<template>
    <div>
        <button class="start-game-btn invisible" @click="startGame">Start Game</button>
        <div class="buy-tile-div invisible">
            <p class="tile-name"></p>
            <div style="justify-content: space-around; flex-flow: row; display: flex">
                <button @click="buy(0)" class="tile price-0"></button>
                <button @click="buy(1)" class="tile price-1"></button>
                <button @click="buy(2)" class="tile price-2"></button>
                <button @click="buy(3)" class="tile price-3"></button>
                <button @click="buy(4)" class="tile price-4"></button>
            </div>
            <button @click="buy(-1)" class="tile mt-3">Don't buy</button>
        </div>
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
.unavailable {
    pointer-events: none;
    opacity: 0.5;
}
.start-game-btn {
    position: absolute;
    top: 90%;  
    left: 90%; 
    transform: translate(-50%, -50%);

    border: 1px solid white;
    background-color: red;
    color: white;
    padding: 10px;
    box-shadow: black 1px 1px 10px;
}
.buy-tile-div {
    position: absolute;
    top: 0;
    left: 0;
    top: 50%;  
    left: 50%; 
    transform: translate(-50%, -50%);
    width: 70%;
}
.tile-name {
    font-size: xx-large;
    margin: 5px;
    color: white;
    text-shadow: black 1px 1px 10px;
}
.tile {
    border: 1px solid white;
    background-color: red;
    color: white;
    padding: 10px;
    box-shadow: black 1px 1px 10px;
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
import {P5Sketch, P5Image, P5Geometry, P5Vector, P5Font} from "vue-p5-component";
import { Element, Vector } from "p5";
import { Board } from "@/models/board";
import { getBoard } from "../lib/getGame"
import { Player } from "@/models/player";
import { Action } from "@/models/game";
import { updateBoard } from "@/lib/updateBoard";
import { requestThrowDice } from "@/lib/requestThrowDice"
import { randint } from "@/lib/randomInt";
import { Tile } from "@/models/tile";
import { buyTile } from "@/lib/buyTile"
import { startGame } from "@/lib/startGame";
import {joinGame} from "@/lib/joinGame"

var loggedUser: Player | undefined
var boardId: number

var currentBoard: Board
var history: Action[] = []
var nextAction: Action | undefined

var updateBoardTimeout: number

var MonoFont: P5Font

var startGameBtn: Element | null

var turnInfoP: Element | null
var throwDicesButton: Element | null
var dicesDiv: Element | null
var dicesNumberDiv: (Element | null)[]

var rollingDices = true

var buyTileDiv: Element | null
var tileName: Element | null
var tilePrices: (Element | null)[] = []

export default Vue.extend({
components: { P5 },
methods: {
    throwDices() {
        const dices = [randint(1, 6), randint(1, 6)]
        rollingDices = false
        dicesNumberDiv[0]?.html(dices[0].toString())
        dicesNumberDiv[1]?.html(dices[1].toString())

        requestThrowDice(boardId, loggedUser!.id, dices).then(res => {
            console.log(res);
        })
    },
    startGame() {
        startGame(boardId, loggedUser!.id).then(res => res && console.log("Game started"))
        startGameBtn?.addClass("invisible")
    },
    setup(sketch: P5Sketch) {
        MonoFont = sketch.loadFont("fonts/KabelBd-Normal.ttf")
        

        boardId = parseInt(this.getCookie("id_cookie") || "0") | 1
        var pseudo = this.getCookie("pseudo_cookie")   

        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        sketch.background(20);
        startGameBtn = sketch.select(".start-game-btn")
        turnInfoP = sketch.select(".turn-info")
        throwDicesButton = sketch.select(".throw")
        dicesDiv = sketch.select(".dices-div")
        dicesNumberDiv = [sketch.select(".dice-1"), sketch.select(".dice-2")]

        buyTileDiv = sketch.select(".buy-tile-div")
        tileName = sketch.select(".tile-name")
        for (const i in [0, 1, 2, 3, 4]) {
            tilePrices.push(sketch.select(`.price-${i}`))
        }
        
        Board.boardImg = sketch.loadImage("Board3D.png")
        Board.boardBackground = sketch.loadImage("bg.jpg")
        Player.model = sketch.loadModel("PawnLowPoly.obj")

        
        updateBoardTimeout = setInterval(() => {
            getBoard(boardId).then(res => {
                if (!currentBoard) {
                    currentBoard = res.board
                    loggedUser = currentBoard.players.find(p => p.name === pseudo)
                    !loggedUser && pseudo && joinGame(boardId, pseudo).then(player => {
                        loggedUser = player
                    })

                } else {
                    updateBoard(currentBoard, res.board, history, res.history, () => {
                        currentBoard = res.board
                        nextAction = res.nextAction
                        const userTurn = currentBoard.players.find(p => p.id === currentBoard.currentTurn)
                        const yourTurn = userTurn?.id === loggedUser?.id
                        if (yourTurn) loggedUser = userTurn
                        
                        currentBoard.currentTurn && turnInfoP?.html(`It's ${yourTurn ? 'your' : currentBoard.getNextPlayer()?.name} turn`)
                        
                        if (yourTurn && nextAction?.description === "TURN"
                            ) {
                            throwDicesButton?.removeClass("invisible")
                            dicesDiv?.removeClass("invisible")
                            rollingDices = true      
                        } else {
                            throwDicesButton?.addClass("invisible")
                            dicesDiv?.addClass("invisible")
                        }

                        if (yourTurn && nextAction?.description === "BUY") {
                            const tile = currentBoard.tiles.find(t => t.id === nextAction?.tilesConcerned)
                            tile && this.applyTilesPrices(tile, userTurn as Player)
                        } else {
                            buyTileDiv?.addClass("invisible")
                        }

                        !currentBoard.hasStarted && currentBoard.players.length >= 2 && currentBoard.players[0].id === loggedUser!.id && startGameBtn?.removeClass("invisible")
                    }) 
                }           
                history = res.history
            })
        }, 2000);
        
        sketch.normalMaterial()

        sketch.windowResized = function() {
            sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight)
        }
        sketch.keyPressed = function() {
            if (sketch.key === " ") {
                console.log(loggedUser);
                console.log(currentBoard);
                console.log(history);
                console.log(nextAction);
            } 
        }
        
    },
    applyTilesPrices(tile: Tile, player: Player) {
        const tileBasePrice = tile.prices.base
        const tileUpgradeCost = tile.prices.upgrade_cost
        const prices = [
            tileBasePrice,
            tileBasePrice + tileUpgradeCost,
            tileBasePrice + tileUpgradeCost * 2,
            tileBasePrice + tileUpgradeCost * 3,
            tileBasePrice + tileUpgradeCost * 4,
        ]    

        buyTileDiv?.removeClass("invisible")
        tileName?.html(`Acheter ${tile.name} ?`)
        for (const [index, priceBtn] of tilePrices.entries()) {
            priceBtn?.html(`${index === 0 ? 'Base' : 'Level ' + index.toString()} : ${prices[index]}K`)
            if (player.money < prices[index]) priceBtn?.addClass("unavailable") 
            else priceBtn?.removeClass("unavailable")
        }
    },
    buy(amount: number) {
        buyTile(boardId, loggedUser!.id, amount).then(res => console.log(res))
        buyTileDiv?.addClass("invisible")
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
    draw(sketch: P5Sketch) {
        
        sketch.background(251, 251, 234)

        sketch.orbitControl(2, 2, 0.02);
        
        sketch.textFont(MonoFont)
        currentBoard && currentBoard.draw(sketch)

        if (rollingDices && dicesNumberDiv.length > 0) {
            dicesNumberDiv[0]?.html(randint(1, 6).toString())
            dicesNumberDiv[1]?.html(randint(1, 6).toString())
        }        
    }
},
});
</script>