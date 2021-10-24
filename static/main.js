import { Board } from './board.js';
import { InputHandler } from './input.js'
import { Snake } from './snake.js';
import { NetworkHandler } from './network.js';


function drawPlayersInfo(board){
    const playersInfo = document.querySelector(".c-players-info")
    playersInfo.innerHTML = ""
    //const playersContainer = document.createElement("div")

    for(let id in board.state.players){
        const player = board.state.players[id]
        const playerData = document.createElement("div")
        playerData.innerHTML = `<div class="player-data ${(id == board.networkHandler.socket.id) ? "local-player" : "remote-player"}" data-player="${player.id}">
                                    <div class="name">Player: @${player.name.slice(0,12).toLowerCase()}</div>
                                    <div class="score">Score: ${player.tail.length - 1}</div>
                                </div>`
        playersInfo.append(playerData)
    }
}

function playGame(networkHandler, localPlayer){
    const board = new Board(networkHandler)
    const inputHandler = new InputHandler()
    board.subscribe(localPlayer)
    localPlayer.subscribe(inputHandler)
    localPlayer.subscribe(board)

    board.field.click()

    let boardRefresh = setInterval(() => {
        board.drawState()
        drawPlayersInfo(board)

    }, board.velocity)
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded');
    
    let playerName = ""
    const nameInput = document.querySelector(".c-name-modal .name")
    const playButton = document.querySelector(".c-name-modal .play-button")
    
    nameInput.addEventListener("keyup", (evt) => {
        playerName = evt.target.value
    })

    playButton.addEventListener("click", (evt) => {
        if(nameInput.value && nameInput.value.length >= 3){
            const  networkHandler = new NetworkHandler()
            playGame(networkHandler, new Snake(networkHandler, playerName))
            document.querySelector('.c-name-modal').style.display = 'none'
        }
    })
})

