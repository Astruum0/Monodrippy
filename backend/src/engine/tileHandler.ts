import { tiles } from "src/tiles/tiles.schema";
import { Action } from 'src/models/action';
import { player } from 'src/player/player.schema';
import { nextPlayer } from './playerMovement';

export function isBuyable(tile: tiles): boolean {
    return tile.owner === null && typeof tile.owner !== 'undefined'
}

export function findPlayerIndex(game: any, player_id: string) {
  for (let index = 0; index < game["players"].length; index++) {
    if (game["players"][index].id == player_id) {
      return index
    }
  }
}

export function buyTile(
  tile_id: number,
  player_id: string,
  game: any,
  player: player,
  game_tile: tiles,
  index: number,
  amount: number = undefined,
): [Action, Action[]] {
  const history = [];
  if (game_tile.owner == null) {
    if (game_tile.type == 'street') {
      const streetPrice = getTilePrice(game_tile, amount)
      if (streetPrice <= player.money) {
        game['tiles'][tile_id].currentLevel = 0;
        game['tiles'][tile_id].owner = player_id;
        game['players'][index].money -= streetPrice;
        game.markModified('tiles');
        game.markModified('players');
        game.save();
        history.push(new Action('BOUGHT', player.id, tile_id));
        return [
          new Action(
            'TURN',
            nextPlayer(
              game.players.find((p) => p.id === player_id),
              game.players,
            ).id,
          ),
          history,
        ];
      } else {
        throw new Error('Not enough money');
      }
    } else if (game_tile.type == 'gare') {
      if (game_tile.prices['base'] <= player.money) {
        game['tiles'][tile_id].owner = player_id;
        game['players'][index].money -= game_tile.prices['base'];
        game.markModified('tiles');
        game.markModified('players');
        game.save();
        history.push(new Action('BOUGHT', player.id, tile_id));
        return [
          new Action(
            'TURN',
            nextPlayer(
              game.players.find((p) => p.id === player_id),
              game.players,
            ).id,
          ),
          history,
        ];
      } else {
        throw new Error('Not enough money');
      }
    } else {
      throw new Error('Not buyable, not a street or gare');
    }
  } else {
    throw new Error('Not buyable, already bought');
  }
}

export function upgradeTile(
  tile_id: number,
  player_id: string,
  game: any,
  player: player,
  game_tile: tiles,
  index: number,
): [Action, Action[]] {
  const history = [];

  if (game_tile.type == 'street') {
    if (game_tile.currentLevel < 4) {
      if (game_tile.prices['upgrade_cost'] <= player.money) {
        game['tiles'][tile_id].currentLevel += 1;
        game['players'][index].money -= game_tile.prices['upgrade_cost'];
        game.markModified('tiles');
        game.markModified('players');
        game.save();
        history.push(new Action('UPGRADED', player.id, tile_id));
        return [
          new Action(
            'TURN',
            nextPlayer(
              game.players.find((p) => p.id === player_id),
              game.players,
            ).id,
          ),
          history,
        ];
      } else {
        throw new Error('Not enough money');
      }
    } else {
      throw new Error("Can't upgrade, wrong level");
    }
  } else {
    throw new Error("Can't upgrade, not a street");
  }
}

export function payRent(
  tile_id: number,
  player_id: string,
  game: any,
  player: player,
  game_tile: tiles,
  index: number,
): [Action, Action[]] {
  const history = [];
  if (game_tile.type == 'street') {
    if (game_tile.owner != player_id) {
      let owner_index = findPlayerIndex(game, game_tile.owner);
      let price = game_tile.rent[game_tile.currentLevel];
      game['players'][index].money -= price;
      game['players'][owner_index].money += price;
      game.markModified('players');
      game.save();
      history.push(new Action('PAID', player_id, tile_id));
      return [
        new Action(
          'TURN',
          nextPlayer(
            game.players.find((p) => p.id === player_id),
            game.players,
          ).id,
        ),
        history,
      ];
    } else {
      throw new Error('Tiles belong to player');
    }
  } else if (game_tile.type == 'gare') {
    if (game_tile.owner != player_id) {
      let owner_index = findPlayerIndex(game, game_tile.owner);
      let gare_index = [4, 14, 23, 32];
      let gare_number = 0;
      for (let index = 0; index < gare_index.length; index++) {
        if (game.tiles[gare_index[index]].owner == game_tile.owner) {
          gare_number += 1;
        }
      }
      let price = game_tile.rent[gare_number - 1];
      game['players'][index].money -= price;
      game['players'][owner_index].money += price;
      game.markModified('players');
      game.save();
      history.push(new Action('PAID', player_id, tile_id));
      return [
        new Action(
          'TURN',
          nextPlayer(
            game.players.find((p) => p.id === player_id),
            game.players,
          ).id,
        ),
        history,
      ];
    } else {
      throw new Error('Tiles belong to player');
    }
  } else {
    throw new Error("Can't pay rent on non gare or street tile");
  }
}

function getTilePrice(tile: tiles, amount: number): number {
    return tile.prices.base + (tile.prices.upgradeCost * amount)
}