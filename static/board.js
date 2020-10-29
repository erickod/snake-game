class Board {
    observers = []
    players = {}
    fruits = {}
    velocity = 100

    constructor(){
        this.field = document.querySelector('[data-id="app"');
        this.ctx = this.field.getContext('2d');
    }

    getLocalPlayer(notification){
        if(notification.type == 'playerId'){
            this.localPlayer = notification.value
        }
    }

    drawSnake(){
        for(let playerKey in this.players){
            for(let i=0; i < this.players[playerKey].tail.length; i++){
                const snakeNode = this.players[playerKey].tail[i];
                if(this.localPlayer == playerKey){
                    const playerColor = this.players[playerKey].color
                    this.ctx.fillStyle = i == 0 ? `rgba(${playerColor}, 0.5)`: `rgba(${playerColor}, 0.3)`;
                }else {
                    this.ctx.fillStyle = i == 0 ? 'rgba(10, 10, 10, 0.3)': 'rgba(10, 10, 10, 0.1)';
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
            this.ctx.fillStyle = 'rgba(255,0,0,0.6)';
            this.ctx.fillRect(fruit.x, fruit.y, 1,1)
        }
    }

    gameRefresh(){
        const notification = boardNotification()
        notification.type = 'gameRefresh'
        this.notifyAll(notification)
    }

    remoteStateMerge(notification){
        if(notification.type == 'state'){
            //console.log(notification)
            
            this.velocity = notification.value.velocity
            this.fruits = notification.value.fruits
            for(let playerKey in notification.value.players){
                let player = notification.value.players[playerKey]
                if(playerKey != this.localPlayer){
                    player = Object.assign({}, this.players[playerKey], player)
                }else{
                    player = Object.assign({}, this.players[playerKey], {score:player['score']})
                }
                this.players[playerKey] = player
            }
        }
        
    }
    removeDisconnectedPlayers(notification){
        if(notification.type == 'playerDesconnection'){
            delete this.players[notification.value]
        }
    }

    snakePositionHandler(notification){
        if(notification.type == 'snakePosition'){
            //console.log(notification)
            const player = notification.value.player
            const playerX = notification.value.position.x
            const playerY = notification.value.position.y
            const tail = notification.value.tail
            const color = notification.value.color
            this.players[player] = {
                position: {x:playerX, y:playerY}, 
                tail:tail,
                color:color
            }
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
        if (notification.type == 'playerDesconnection'){
            //console.log(notification)
        }
        this.getLocalPlayer(notification)
        this.remoteStateMerge(notification)
        this.snakePositionHandler(notification)
        this.fruitHandler(notification)
        this.removeDisconnectedPlayers(notification)
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
