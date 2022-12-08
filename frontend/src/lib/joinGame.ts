import { Player } from "@/models/player";

export function joinGame(id: number, pseudo: string): Promise<Player> {
    console.log("PLAYER JOINED : ", pseudo, id);
    
    const url = `${process.env.VUE_APP_API_URL}/boards/join/${id}`

    const data = {
        name: pseudo
    }

    return fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        if (res.error) console.error(res.error);
        return res as Player})
}