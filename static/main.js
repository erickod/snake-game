import { Board } from './board.js';
import { InputHandler } from './input.js'
import { Snake } from './snake/snake.js';
import { NetworkHandler } from './network.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');
    const socket = io()

    const inputHandler = new InputHandler()
    const netHandler = new NetworkHandler(socket)
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
        board.gameRefresh()
        board.drawBoard()
        board.drawSnake()
        board.drawFuit()
        board.hasSnakeTheSamePositionWichFruit()

        count ++

        if(count == -15){
            clearInterval(boardRefresh)
        }

    }, board.velocity)
})