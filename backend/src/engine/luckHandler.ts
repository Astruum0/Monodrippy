export async function luckAction(board_id: number, luck_id: number, player_id: string) {
    let game = await this.boardModel.findOne({
        id: board_id
    }).exec();
    let player = await this.playerModel.findOne({
        id: player_id
    }).exec();
    let index = findPlayerIndex(game, player.id)

    let luck = game["lucks"][luck_id]
    let effect = luck.cardEffect["effect"]
    let value = luck.cardEffect["value"]
    switch (effect) {
        case "loseMoney":
            game["players"][index].money -= value
            break;
        case "gainMoney":
            game["players"][index].money += value
            break;
        case "moveTo":
            if (game["players"][index].position > value) {
                game["players"][index].money += 150
            }
            game["players"][index].position = value
            break;
        case "moveToStraight":
            game["players"][index].position = value
            break;
        case "nextThrow":
            game["players"][index].nextThrowModifier = value
            break;
        default:
            return new Error("No such effect")
    }
    game.markModified("players")
    game.save()
}


function findPlayerIndex(game: any, player_id: string) {
    for (let index = 0; index < game["players"].length; index++) {
        if (game["players"][index].id == player_id) {
            return index
        }
    }
}