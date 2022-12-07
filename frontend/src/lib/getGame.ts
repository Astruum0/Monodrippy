import { Board } from "@/models/board";
import { Game } from "@/models/game";

export function getBoard(id: number): Promise<Game>{
    return fetch(`http://api.arthurvella.com:3001/game/${id}`)
        .then(res => res.json())
        .then(res => res as Game)
        .then(res => {
            res.board = new Board(res.board)
            return res
        })
}