

class Board {
    observers = []
    velocity = 100
    state = {
        players: {},
        fruits: {},
    }

    constructor(networkHandler){
        this.networkHandler = networkHandler
        this.localPlayerId = this.networkHandler.socket.id
        this.networkHandler.getRemoteState()
        this.field = document.querySelector('[data-id="app"');
        this.ctx = this.field.getContext('2d');

        this.networkHandler.socket.on("updateState", (state) => {
            delete state.players[this.networkHandler.socket.id]
            this.state.players = state.players
            this.state.fruits = state.fruits
        })

        this.getState()
    }

    drawSnake(){
        for(let playerKey in this.state.players){
            for(let i=0; i < this.state.players[playerKey].tail.length; i++){
                const snakeNode = this.state.players[playerKey].tail[i];
                if(playerKey == this.networkHandler.socket.id){
                    this.ctx.fillStyle = i == 0 ? '#212d5d ': '#212D5D88';
                } else{
                    this.ctx.fillStyle = i == 0 ? '#4d4d4d55 ': '#66666655';
                }
                
                this.ctx.fillRect(snakeNode.x, snakeNode.y, 1,1)
            }
        }
        
    }
    
    hasSnakeTheSamePositionWichFruit(){
        let forControlFlag = true

        for(let playerKey in this.state.players){
            const player = this.state.players[playerKey];
            for(let fruitKey in this.state.fruits){
                const fruit = this.state.fruits[fruitKey]

                if(player.tail[0].x == fruit.x && player.tail[0].y == fruit.y){
                    player.tail.unshift({x:fruit.x, y:fruit.y})
                    forControlFlag = true
                    break
                }

                if(forControlFlag){
                    break
                }
            }
        }
    }


    drawBoard(){
        this.ctx.fillStyle = 'lightgreen';
        this.ctx.fillRect(0,0,20,20);
    }
    drawFuit(){
        for(let fruit of this.state.fruits){
            this.ctx.fillStyle = 'purple';
            this.ctx.fillRect(fruit.x, fruit.y, 1,1)
        }
    }

    gameRefresh(){
        const notification = boardNotification()
        notification.type = 'gameRefresh'
        this.notifyAll(notification)
    }

    snakePositionHandler(notification){
        if(notification && notification.type == 'snakePosition'){
            this.state.players[this.networkHandler.socket.id] = notification.value
        }
    }

    getState(){
        this.networkHandler.socket.emit("getState")
    }

    drawState(){
        this.getState()
        this.gameRefresh()
        this.drawBoard()
        this.drawFuit()
        this.drawSnake()
        this.hasSnakeTheSamePositionWichFruit()
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