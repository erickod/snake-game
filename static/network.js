class NetworkHandler {
    observers = []

    constructor(socket = io()){
        this.socket = socket
    }

    notifyPlayerId(){
        this.socket.on('connect', (context=this) => {
            const notification = networkNotification()
            notification.type = 'playerId'
            notification.value = this.socket.id
            notification.socket = this.socket
            this.notifyAll(notification)
        })
    }

    snakePositionHandler(notification){
        if(notification.type == 'snakePosition'){
            this.socket.emit(notification.type, notification)
        }
    }

    gameRefreshHandler(notification){
        if(notification.type != 'gameRefresh') return
        //console.log('gameRefreshHandler')
        this.socket.emit('getState', ()=>{
            this.socket.on('getState', (s)=>{
                s.socket = this.socket
                this.notifyAll(s)
            })
        })
    }

    genarateRandomFruit(notification){
        if(notification.type == "getNewFruit"){
            this.socket.emit('genarateRandomFruit', ()=>{
                this.socket.on('genarateRandomFruit', (fruit) => {
                    notification = networkNotification()
                    notification.type = 'fruitGeneration'
                    notification.value = fruit
                    this.notifyAll(notification)
                })
            })
        }
    }

    deleteFruit(notification){
        if(notification.type == "deleteFruit"){
            this.socket.emit('deleteFruit', notification.value)
            
        }
    }


    subscribe(subject){
        subject.attach(this)
    }

    unsubscribe(subject){
        subject.dettach(this)
    }

    update(notification){
        this.snakePositionHandler(notification)
        this.gameRefreshHandler(notification)
        this.genarateRandomFruit(notification)
        this.deleteFruit(notification)
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

}

const networkNotification = () => {
    return {
        sender: 'networkHandler',
        type:'',
        value:''
    }
}

export { NetworkHandler }