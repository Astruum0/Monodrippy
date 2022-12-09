export function startGame(boardId: number, userId: string): Promise<boolean> {
    const url = `http://127.0.0.1:3001/game/start/${boardId}`;

    return fetch(url, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json', 'Authorization': userId}, 
      })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                console.error(res.error)
                return false
            }
            return true
         } )
}