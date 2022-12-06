<template>
  <div>
    <button class="start-game-btn invisible" @click="startGame">
      Commencer la partie
    </button>
    <div class="buy-tile-div invisible">
      <p class="tile-name"></p>
      <div style="justify-content: space-around; flex-flow: row; display: flex">
        <button @click="buy(0)" class="tile price-0 invisible"></button>
        <button @click="buy(1)" class="tile price-1 invisible"></button>
        <button @click="buy(2)" class="tile price-2 invisible"></button>
        <button @click="buy(3)" class="tile price-3 invisible"></button>
        <button @click="buy(4)" class="tile price-4 invisible"></button>
      </div>
      <button @click="buy(-1)" class="tile mt-3">Ne pas acheter</button>
    </div>
    <div class="turn-div">
      <p class="turn-info"></p>
      <button class="throw invisible" @click="throwDices">Lancer les dés</button>
      <div class="dices-div invisible">
        <span class="dice-1">1</span>
        <span class="dice-2">1</span>
      </div>
    </div>
    <div class="luck-card invisible">
      <button class="hide-card" @click="hideCard">x</button>
      <h3 class="luck-title"></h3>
      <p class="luck-desc"></p>
    </div>
    <P5 v-on="{ setup, draw }" />
  </div>
</template>

<style>
@import "@/assets/hud.css";
</style>

<script lang="ts">
import Vue from "vue";
import P5 from "./P5.vue";
import { P5Sketch, P5Font } from "vue-p5-component";
import { Element } from "p5";
import { Board } from "@/models/board";
import { getBoard } from "../lib/getGame";
import { Player } from "@/models/player";
import { Action } from "@/models/game";
import { Luck } from "@/models/luck";
import { updateBoard } from "@/lib/updateBoard";
import { requestThrowDice } from "@/lib/requestThrowDice";
import { randint } from "@/lib/randomInt";
import { Tile } from "@/models/tile";
import { buyTile } from "@/lib/buyTile";
import { startGame } from "@/lib/startGame";
import { joinGame } from "@/lib/joinGame";

var loggedUser: Player | undefined;
var boardId: number;

var currentBoard: Board;
var history: Action[] = [];
var nextAction: Action | undefined;

var updateBoardTimeout: number;

var MonoFont: P5Font;

var startGameBtn: Element | null;

var turnInfoP: Element | null;
var throwDicesButton: Element | null;
var dicesDiv: Element | null;
var dicesNumberDiv: (Element | null)[];

var rollingDices = true;

var buyTileDiv: Element | null;
var tileName: Element | null;
var tilePrices: (Element | null)[] = [];

var luckCardDiv: Element | null;
var luckCardTitle: Element | null;
var luckCardDesc: Element | null;

export default Vue.extend({
  components: { P5 },
  methods: {
    throwDices() {
      const dices = [randint(1, 6), randint(1, 6)];
      rollingDices = false;
      dicesNumberDiv[0]?.html(dices[0].toString());
      dicesNumberDiv[1]?.html(dices[1].toString());

      requestThrowDice(boardId, loggedUser!.id, dices).then((res) => {
        console.log(res);
      });
    },
    startGame() {
      startGame(boardId, loggedUser!.id).then(
        (res) => res && console.log("Game started")
      );
      startGameBtn?.addClass("invisible");
    },
    setup(sketch: P5Sketch) {
      MonoFont = sketch.loadFont("fonts/KabelBd-Normal.ttf");

      boardId = parseInt(this.getCookie("id_cookie") || "0") | 1;
      var pseudo = this.getCookie("pseudo_cookie");

      sketch.createCanvas(
        sketch.windowWidth,
        sketch.windowHeight,
        sketch.WEBGL
      );
      sketch.background(20);
      startGameBtn = sketch.select(".start-game-btn");
      turnInfoP = sketch.select(".turn-info");
      throwDicesButton = sketch.select(".throw");
      dicesDiv = sketch.select(".dices-div");
      dicesNumberDiv = [sketch.select(".dice-1"), sketch.select(".dice-2")];

      buyTileDiv = sketch.select(".buy-tile-div");
      tileName = sketch.select(".tile-name");
      for (const i in [0, 1, 2, 3, 4]) {
        tilePrices.push(sketch.select(`.price-${i}`));
      }

      luckCardDiv = sketch.select(".luck-card");
      luckCardTitle = sketch.select(".luck-title");
      luckCardDesc = sketch.select(".luck-desc");

      Board.boardImg = sketch.loadImage("Board3D.png");
      Board.boardBackground = sketch.loadImage("bg.jpg");
      Player.model = sketch.loadModel("PawnLowPoly.obj");
      Luck.div = luckCardDiv;
      Luck.title = luckCardTitle;
      Luck.desc = luckCardDesc;

      updateBoardTimeout = setInterval(() => {
        getBoard(boardId).then((res) => {
          if (!currentBoard) {
            currentBoard = res.board;
            loggedUser = currentBoard.players.find((p) => p.name === pseudo);
            !loggedUser &&
              pseudo &&
              joinGame(boardId, pseudo).then((player) => {
                loggedUser = player;
              });
          } else {
            updateBoard(currentBoard, res.board, history, res.history, () => {
              currentBoard = res.board;
              nextAction = res.nextAction;
              const userTurn = currentBoard.players.find(
                (p) => p.id === currentBoard.currentTurn
              );
              const yourTurn = userTurn?.id === loggedUser?.id;
              if (yourTurn) loggedUser = userTurn;

              currentBoard.currentTurn &&
                turnInfoP?.html(yourTurn ? "C'est ton tour" : `C'est au tour de ${currentBoard.getNextPlayer()?.name}`);

              if (yourTurn && nextAction?.description === "TURN") {
                throwDicesButton?.removeClass("invisible");
                dicesDiv?.removeClass("invisible");
                rollingDices = true;
              } else {
                throwDicesButton?.addClass("invisible");
                dicesDiv?.addClass("invisible");
              }

              if (yourTurn && nextAction?.description === "BUY") {
                const tile = currentBoard.tiles.find(
                  (t) => t.id === nextAction?.tilesConcerned
                );
                tile && this.applyTilesPrices(tile, userTurn as Player);
              } else {
                this.hideTilesPrices()
              }

              !currentBoard.hasStarted &&
                currentBoard.players.length >= 2 &&
                currentBoard.players[0].id === loggedUser!.id &&
                startGameBtn?.removeClass("invisible");
            });
          }
          history = res.history;
        });
      }, 2000);

      sketch.normalMaterial();

      sketch.windowResized = function () {
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
      };
      sketch.keyPressed = function () {
        if (sketch.key === " ") {
          console.log(loggedUser);
          console.log(currentBoard);
          console.log(history);
          console.log(nextAction);
        }
      };
    },
    applyTilesPrices(tile: Tile, player: Player) {
      const tileBasePrice = tile.prices.base;
      const tileUpgradeCost = tile.prices.upgrade_cost;
      const prices = [
        tileBasePrice,
        tileBasePrice + tileUpgradeCost,
        tileBasePrice + tileUpgradeCost * 2,
        tileBasePrice + tileUpgradeCost * 3,
        tileBasePrice + tileUpgradeCost * 4,
      ];

      buyTileDiv?.removeClass("invisible");
      tileName?.html(`Acheter ${tile.name} ?`);
      for (const [index, priceBtn] of tilePrices.entries()) {
        priceBtn?.html(
          `${index === 0 ? "Base" : "Niveau " + index.toString()} : ${
            prices[index]
          }K`
        );
        if (!(tile.type === "gare" && index > 0)) {
          priceBtn?.removeClass("invisible")
        }
        if (tile.type === "gare") priceBtn?.html(`Prix : ${prices[0]}K`)
        if (player.money < prices[index]) priceBtn?.addClass("unavailable");
        else priceBtn?.removeClass("unavailable");
      }
    },
    hideTilesPrices() {
      buyTileDiv?.addClass("invisible");
      for (const priceBtn of tilePrices) {
        priceBtn?.addClass("invisible")
      }
    },
    buy(amount: number) {
      buyTile(boardId, loggedUser!.id, amount).then((res) => console.log(res));
      buyTileDiv?.addClass("invisible");
    },
    getCookie(name: string) {
      var cookie_name = name + "=";
      var data = document.cookie.split(";");
      for (var i = 0; i < data.length; i++) {
        var c = data[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(cookie_name) == 0) {
          return c.substring(cookie_name.length, c.length);
        }
      }
    },
    draw(sketch: P5Sketch) {
      sketch.background(251, 251, 234);

      sketch.orbitControl(2, 2, 0.02);

      sketch.textFont(MonoFont);
      currentBoard && currentBoard.draw(sketch);

      if (rollingDices && dicesNumberDiv.length > 0) {
        dicesNumberDiv[0]?.html(randint(1, 6).toString());
        dicesNumberDiv[1]?.html(randint(1, 6).toString());
      }
    },
    hideCard() {
      luckCardDiv?.addClass("invisible");
    },
  },
});
</script>
