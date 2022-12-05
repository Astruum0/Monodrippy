import { tiles } from 'src/tiles/tiles.schema';
import { Action } from 'src/models/action';
import { player } from 'src/player/player.schema';
import { nextPlayer } from './playerMovement';
import { board } from 'src/board/board.schema';

export function isBuyable(tile: tiles): boolean {
  return tile.owner === null && typeof tile.owner !== 'undefined';
}

export function findPlayerIndex(game: any, player_id: string) {
  for (let index = 0; index < game['players'].length; index++) {
    if (game['players'][index].id == player_id) {
      return index;
    }
  }
}

export function buyTile(
  game: board,
  player: player,
  tile: tiles,
  amount: number = undefined,
): [Action, Action[]] {
  const history = [];
  if (tile.owner == null) {
    if (tile.type == 'street') {
      const streetPrice = getTilePrice(tile, amount);
      if (streetPrice <= player.money) {
        tile.currentLevel = amount;
        tile.owner = player.id;
        player.money -= streetPrice;
        history.push(new Action('BOUGHT', player.id, tile.id));
        return [
          new Action(
            'TURN',
            nextPlayer(
              game.players.find((p) => p.id === player.id),
              game.players,
            ).id,
          ),
          history,
        ];
      } else {
        throw new Error('Not enough money');
      }
    } else if (tile.type == 'gare') {
      if (tile.prices['base'] <= player.money) {
        tile.owner = player.id;
        player.money -= tile.prices['base'];
        history.push(new Action('BOUGHT', player.id, tile.id));
        return [
          new Action(
            'TURN',
            nextPlayer(
              game.players.find((p) => p.id === player.id),
              game.players,
            ).id,
          ),
          history,
        ];
      } else {
        throw new Error('Not enough money');
      }
    } else {
      throw new Error('Not buyable, not a street nor a gare');
    }
  } else {
    throw new Error('Not buyable, already bought');
  }
}

export function upgradeTile(
  game: board,
  player: player,
  tile: tiles,
): [Action, Action[]] {
  const history = [];

  if (tile.type == 'street') {
    if (tile.currentLevel < 4) {
      if (tile.prices['upgrade_cost'] <= player.money) {
        tile.currentLevel += 1;
        player.money -= tile.prices['upgrade_cost'];
        history.push(new Action('UPGRADED', player.id, tile.id));
        return [
          new Action(
            'TURN',
            nextPlayer(
              game.players.find((p) => p.id === player.id),
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
  game: board,
  player: player,
  tile: tiles,
): [Action, Action[]] {
  const history = [];
  if (tile.type == 'street') {
    if (tile.owner != player.id) {
      let owner = game.players[findPlayerIndex(game, tile.owner)];
      let price = tile.rent[tile.currentLevel];
      if (player.money >= price) {
        player.money -= price;
        owner.money += price;
      } else {
        price = player.money
        owner.money += price
        player.hasLosed = true
        history.push(new Action(`LOST GAME`, player.id));
      }

      history.push(new Action(`PAID ${price}`, player.id, tile.id));
      history.push(new Action(`GAINED ${price}`), owner.id, tile.id);
      return [
        new Action(
          'TURN',
          nextPlayer(
            game.players.find((p) => p.id === player.id),
            game.players,
          ).id,
        ),
        history,
      ];
    } else {
      throw new Error('Tiles belong to player');
    }
  } else if (tile.type == 'gare') {
    if (tile.owner != player.id) {
      let owner_index = findPlayerIndex(game, tile.owner);
      let gare_index = [4, 14, 23, 32];
      let gare_number = 0;
      for (let index = 0; index < gare_index.length; index++) {
        if (game.tiles[gare_index[index]].owner == tile.owner) {
          gare_number += 1;
        }
      }
      let price = tile.rent[gare_number - 1];
      player.money -= price;
      game['players'][owner_index].money += price;
      history.push(new Action('PAID', player.id, tile.id));
      return [
        new Action(
          'TURN',
          nextPlayer(
            game.players.find((p) => p.id === player.id),
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
  return tile.prices.base + tile.prices.upgrade_cost * amount;
}
