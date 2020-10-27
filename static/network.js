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
    }

    notifyConnect(){
        this.playerId()
    }

    notifyDisconnect(){
        this.socket.on('playerDesconnection', (notification)=>{
            this.notifyAll(notification)
        })
    }

    getPlayerId(){
        const notification = networkNotification()
        notification.type = 'playerId'
        notification.socket = this.socket

        this.socket.on('connect', () => {
            notification.value = this.socket.id
            this.notifyAll(notification)
        })
    }

    snakePositionHandler(notification){
        if(notification.type == 'snakePosition'){
            this.socket.emit(notification.type, notification)
        }
    }
    getRemoteState(){
        this.socket.emit('getState')
        this.socket.on('responseGetState', (remoteState, )=>{
            //console.log(remoteState)
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
        this.snakePositionHandler(notification)
        this.genarateRandomFruit(notification)
        this.getRemoteStateOnBoardRefresh(notification)
        this.notifyDisconnect()
        this.getRemoteState()
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