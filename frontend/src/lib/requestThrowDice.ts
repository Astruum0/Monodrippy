import { Game } from "@/models/game";

export function requestThrowDice(boardId: number, userId: string, dices: number[]):Promise<Game | {error : string}> {
    const data = {
        type: "TURN",
        userId,
        boardId,
        dices
    }
    const url = "http://api.arthurvella.com:3001/game/play";

    return fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(res => res as Game | {error: string})
}