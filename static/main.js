import { Board } from './board.js';
import { Fruit } from './fruit.js';
import { InputHandler } from './input.js'
import { Snake } from './snake.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');

    const inputHandler = new InputHandler()
    const board = new Board()

    const fruit = new Fruit()
    board.subscribe(fruit)
    fruit.subscribe(board)

    fruit.genarateRandomFruit()

    const localPlayer = new Snake()
    board.subscribe(localPlayer)

    localPlayer.subscribe(inputHandler)
    localPlayer.subscribe(board)
    

    let boardRefresh = setInterval(() => {
        board.drawBoard()
        board.drawSnake()
        board.drawFuit()
        board.gameRefresh(fruit.genarateRandomFruit)

    }, 150)
})