import { Board } from "@/models/board";

export function getBoard(id: number): Promise<Board>{
    return fetch(`http://localhost:3001/boards/${id}`)
        .then(res => res.json())
        .then(res => res as Board)
}