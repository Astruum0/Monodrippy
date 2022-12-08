import { Game } from "@/models/game";

export function buyTile(boardId: number, userId: string, amount: number):Promise<Game> {
    const data = {
        type: "BUY",
        userId,
        boardId,
        amount
    }
    const url = `${process.env.VUE_APP_API_URL}/game/play`;

    return fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(res => {
            if (res.error) console.error(res.error);
            return res as Game})
}