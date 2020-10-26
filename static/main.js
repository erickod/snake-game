import { InputHandler } from './input.js'
import { Snake } from './snake.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');

    const field = document.querySelector('[data-id="app"');
    const ctx = field.getContext('2d');

    const inputHandler = new InputHandler()
    
    const localPlayer = new Snake()
    localPlayer.subscrite(inputHandler)


    let fruit = getRandomFruit()

    function getRandomFruit(){
        return {
            x: Math.floor(Math.random() * 20),
            y:Math.floor(Math.random() * 20)
        }
    }

    function snakeGetFruit(){
        if(localPlayer.tail[0].x == fruit.x && localPlayer.tail[0].y == fruit.y){
            localPlayer.tail.unshift(fruit)
            fruit = getRandomFruit()
        }
    }

    function drawBoard(){
        ctx.fillStyle = 'lightgreen';
        ctx.fillRect(0,0,20,20);
    }

    function drawSnake(){
        for(let i=0; i < localPlayer.tail.length; i++){
            const snakeNode = localPlayer.tail[i];
            ctx.fillStyle = 'blue';
            ctx.fillRect(snakeNode.x, snakeNode.y, 1,1)
        }
    }

    function drawFuit(fruit){
        ctx.fillStyle = 'red';
        ctx.fillRect(fruit.x, fruit.y, 1,1)

    }
  


    let gameRefresh = setInterval(() => {
        drawBoard()
        drawSnake()
        drawFuit(fruit)

        // save head position
        localPlayer.position.x = localPlayer.tail[0].x
        localPlayer.position.y = localPlayer.tail[0].y

        // Update position
        if(localPlayer.direction == 'left'){
            if(localPlayer.position.x <= 0 ){
                localPlayer.position.x = 19
            }else {
                localPlayer.position.x -= 1
            }
        }

        if(localPlayer.direction == 'right'){
            if(localPlayer.position.x >= 19 ){
                localPlayer.position.x = 0
            }else {
                localPlayer.position.x += 1
            }
        }
        
        if(localPlayer.direction == 'up'){
            if(localPlayer.position.y <= 0 ){
                localPlayer.position.y = 19
            }else {
                localPlayer.position.y -= 1
            }
        }

        if(localPlayer.direction == 'down'){
            if(localPlayer.position.y >= 19 ){
                localPlayer.position.y = 0
            }else {
                localPlayer.position.y += 1
            }
        }
        
        // remove last snake node
        localPlayer.tail.pop()
        // add update node to the snake
        localPlayer.tail.unshift({x:localPlayer.position.x, y:localPlayer.position.y})

        snakeGetFruit()

    }, 100)
})