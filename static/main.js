import { Board } from './board.js';
import { Fruit } from './fruit.js';
import { InputHandler } from './input.js'
import { Snake } from './snake.js';
import { NetworkHandler } from './network.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');

    const inputHandler = new InputHandler()
    const netHandler = new NetworkHandler()
    const localPlayer = new Snake()
    const board = new Board()
    window.board = board
    
    localPlayer.subscribe(inputHandler)
    localPlayer.subscribe(netHandler)
    localPlayer.subscribe(board)

    board.subscribe(netHandler)
    board.subscribe(localPlayer)

    netHandler.subscribe(localPlayer)
    netHandler.subscribe(board)
    netHandler.getRemoteState()
    netHandler.getPlayerId()
    
    let count = 0

    let boardRefresh = setInterval(() => {
        board.drawBoard()
        board.drawSnake()
        board.drawFuit()
        board.gameRefresh()
        board.hasSnakeTheSamePositionWichFruit()

        count ++

        if(count == -15){
            clearInterval(boardRefresh)
        }

    }, board.velocity)
})