# BACKEND

## /board/start/id

Description:

This endpoint starts a game with the specified ID. The first player ID should be provided in the request headers to confirm the launch of the game.

Method:

POST

Parameters:

- id: The ID of the game to start.

Request headers:

- player_id: The ID of the first player to confirm the launch of the game.

Response:

- On success, a 200 OK response is returned, along with a JSON object containing the details of the game.
- On failure, a 4xx or 5xx error code is returned, along with an error message.

## /boards/join/id

Description:

This endpoint adds a player to a game with the specified ID. The player's name should be provided in the request body.

Method:

POST

Parameters:

- id: The ID of the game to join.

Request body:

- player_name: The name of the player to add to the game.

Response:

- On success, a 200 OK response is returned, along with a JSON object containing the details of the game and the new player.
- On failure, a 4xx or 5xx error code is returned, along with an error message.

## /game/play

Method:

POST

This endpoint allows a user to make a move in a game on a specified game server.

The request body should contain the following parameters:

- userId: The ID of the user making the move.
- boardId: The ID of the game server where the game is being played.
- dices: Two integers representing the values of the dice that were thrown by the player. This parameter should be provided if the user is moving their piece on the board (i.e., not buying a street).
- amount: The level of the street that was bought. This parameter should be provided if the user is buying a street.

Example request body:

```json
{
  "userId": "35cf3ef0-429e-4c07-b5d3-de6a30dce017",
  "boardId": 1,
  "dices": [3, 5]
}
```

Response:

- On success, a 200 OK response is returned, along with a JSON object containing the details of the game.
- On failure, a 4xx or 5xx error code is returned, along with an error message.
