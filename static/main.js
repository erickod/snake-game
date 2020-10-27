import { Board } from './board.js';
import { Fruit } from './fruit.js';
import { InputHandler } from './input.js'
import { Snake } from './snake.js';
import { NetworkHandler } from './network.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');

    const netHandler = new NetworkHandler()
    const inputHandler = new InputHandler()
    const localPlayer = new Snake()
    const board = new Board()
    window.board = board
    //const fruit = new Fruit()
    
    //board.subscribe(fruit)
    //fruit.subscribe(board)
    //fruit.genarateRandomFruit()

    netHandler.subscribe(localPlayer)
    netHandler.subscribe(board)
    localPlayer.subscribe(netHandler)
    localPlayer.subscribe(inputHandler)
    localPlayer.subscribe(board)
    board.subscribe(localPlayer)
    board.subscribe(netHandler)

    netHandler.notifyPlayerId()
    board.notifyAll({type:"getNewFruit"})
    
    let count = 0

    let boardRefresh = setInterval(() => {
        board.drawBoard()
        board.drawSnake()
        board.drawFuit()
        board.gameRefresh()
        board.hasSnakeTheSamePositionWichFruit()

        count ++

        if(count == -5){
            clearInterval(boardRefresh)
        }

    }, board.velocity)
})