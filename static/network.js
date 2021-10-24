/*
TODO: NetworkHandler inicia conexão; -
TODO: Solicita estado remoto; -
TODO: Se não houver frutas no estado, socita a criação de uma;
TODO: Notifica PlayerID para registro de usuário;
TODO: Solicita estado remoto;
TODO: Notifica estado remoto;
*/


class NetworkHandler {
    observers = []
    playerId = ''

    constructor(socket = io()){
        this.socket = socket
        this.connect()
    }

    connect(){
        this.socket.on('connect', () => {
            console.log(`Connected to the server with id ${this.socket.id}`)
            const playerIdNotification = networkNotification()
            playerIdNotification.type = "playerIdNotification"
            playerIdNotification.value = this.socket.id

            this.notifyAll(
                playerIdNotification
            )
        })
    }
    getRemoteState(){
        this.socket.emit('getState')
        this.socket.on('responseGetState', (remoteState)=>{
            console.log(remoteState)
            remoteState.socket = this.socket

            //console.log(notification)
            this.notifyAll(remoteState)
        })
    }

    getRemoteStateOnBoardRefresh(notification={type:'gameRefresh'}){
        if(notification.type != 'gameRefresh') return
        this.getRemoteState()
    }

    genarateRandomFruit(notification={type:"getNewFruit"}){
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
        //this.snakePositionHandler(notification)
        // this.genarateRandomFruit(notification)
        // this.getRemoteStateOnBoardRefresh(notification)
        //this.deleteFruit(notification)
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