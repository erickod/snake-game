class Board {
    observers = []
    players = {}
    fruits = {}
    velocity = 100

    constructor(){
        this.field = document.querySelector('[data-id="app"');
        this.ctx = this.field.getContext('2d');
    }

    markLocalPlayer(notification){
        if(notification.type == 'playerId'){
            this.localPlayer = notification.value
        }
    }

    drawSnake(){
        for(let playerKey in this.players){
            
            for(let i=0; i < this.players[playerKey].tail.length; i++){
                const snakeNode = this.players[playerKey].tail[i];
                if(this.localPlayer == playerKey){
                    this.ctx.fillStyle = i == 0 ? 'darkblue ': 'blue';
                }else {
                    this.ctx.fillStyle = i == 0 ? 'black ': 'gray';
                }
                
                this.ctx.fillRect(snakeNode.x, snakeNode.y, 1,1)
            }
            
        }
    }
    
    hasSnakeTheSamePositionWichFruit(){
        for(let playerKey in this.players){
            const player = this.players[playerKey];

            for(let fruitKey in this.fruits){
                const fruit = this.fruits[fruitKey]

                if(player.tail[0].x == fruit.x && player.tail[0].y == fruit.y){
                    player.tail.unshift({x:fruit.x, y:fruit.y})

                    let notification = boardNotification()
                    notification.type = "getNewFruit"
                    this.notifyAll(notification)

                    //notify player score
                    //TODO: send to server state
                    notification.type = "playerUpdateScore"
                    notification.value = {player:playerKey}
                    this.notifyAll(notification)

                    console.log(fruit)
                    notification.type = "deleteFruit"
                    notification.value = fruit
                    this.notifyAll(notification)
                    delete this.fruits[fruit.id]
                }
            }
        }
    }


    drawBoard(){
        this.ctx.fillStyle = 'lightgreen';
        this.ctx.fillRect(0,0,20,20);
    }
    drawFuit(){
        for(let fruitKey in this.fruits){
            const fruit = this.fruits[fruitKey]
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(fruit.x, fruit.y, 1,1)
        }
    }

    gameRefresh(){
        const notification = boardNotification()
        notification.type = 'gameRefresh'
        this.notifyAll(notification)
    }

    fruitHandler(notification){
        if(notification.type == 'fruitGeneration'){
            
            console.log(notification)
            const fruit = notification.value
            this.fruits[fruit.id] = fruit

            // for(let id in notification.value){
            //     this.fruits[id] = notification.value[id]
            // }
        }
    }

    remoteStateMerge(notification){
        if(notification.type == 'state'){
            for(let playerKey in notification.value.players){
                let player = notification.value.players[playerKey]
                player = Object.assign({}, this.players[playerKey], player)
                this.players[playerKey] = player
            }
        }
        
    }

    snakePositionHandler(notification){
        if(notification.type == 'snakePosition'){
            //console.log(notification)
            const player = notification.value.player
            const playerX = notification.value.position.x
            const playerY = notification.value.position.y
            const tail = notification.value.tail
            //this.players[player] = {x: playerX, y:playerY, tail:tail}
            this.players[player] = {position: {x:playerX, y:playerY}, tail:tail}
        }
    }

    attach(observer){
        if(!(observer in this.observers)){
            this.observers.push(observer)
        }
    }

    dettach(){
        const i = this.observers.indexOf(observer)
        if(i){
            delete this.observers[i]
        }
    }

    notifyAll(notification){
        for(let observer of this.observers){
            observer.update(notification)
        }
    }

    subscribe(subject){
        subject.attach(this)
    }

    unsubscrite(subject){
        subject.dettach(this)
    }

    update(notification){
        this.fruitHandler(notification)
        this.markLocalPlayer(notification)
        this.remoteStateMerge(notification)
        this.snakePositionHandler(notification)
    }

}


const boardNotification = () => {
    return {
        sender: 'Board',
        type:'',
        value:''
    }
}

export { Board }