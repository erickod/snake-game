class Snake {
    constructor(){
        this.observers = []

        this.name = ''
        this.position = {
            x:null,
            y:null
        };

        this.direction = ['left', 'right', 'up','down'][Math.floor(Math.random() * 4)];
        this.score = 0;
        this.tail = [
            { x:Math.floor(Math.random() * 20), y:Math.floor(Math.random() * 20) },
        ]
    }

    disconnect(socket){
        window.addEventListener("beforeunload", function(e, context=this){
            notification = snakeNotification()
            notification.type = 'playerDesconnection'
            notification.value = this.name
            socket.emit(notification.type, notification)
            context.notifyAll(notification)
         }, false);
    }

    registerUser(notification){
        if(notification.type != 'playerId' && this.name != '') return

        this.name = notification.value
        const socket = notification.socket
        
        const registerUserNotification = snakeNotification()
        registerUserNotification.type = 'registerPlayer'
        registerUserNotification.value = {
            player: this.name, 
            position: this.position,
            tail: this.tail,
            score: this.score
        }

        socket.emit(registerUserNotification.type, registerUserNotification)
        this.notifyAll(registerUserNotification)

        this.disconnect(socket)
    }

    subscribe(subject){
        subject.attach(this)
    }

    unsubscribe(subject){
        subject.dettach(this)
    }

    update(notification){
        this.registerUser(notification)
        this.inputHandler(notification)
        this.gameRefreshHandler(notification)
    }

    gameRefreshHandler(notification){
        if(notification.type != 'gameRefresh') return

        // save head position
        this.position.x = this.tail[0].x
        this.position.y = this.tail[0].y

        // Update position
        if(this.direction == 'left'){
            if(this.position.x <= 0 ){
                this.position.x = 19
            }else {
                this.position.x -= 1
            }
        }

        if(this.direction == 'right'){
            if(this.position.x >= 19 ){
                this.position.x = 0
            }else {
                this.position.x += 1
            }
        }
        
        if(this.direction == 'up'){
            if(this.position.y <= 0 ){
                this.position.y = 19
            }else {
                this.position.y -= 1
            }
        }

        if(this.direction == 'down'){
            if(this.position.y >= 19 ){
                this.position.y = 0
            }else {
                this.position.y += 1
            }
        }
        
        //update snake tail  
        this.tail.pop()
        this.tail.unshift({x:this.position.x, y:this.position.y})

        //notify position
        const notificationSnakePosition = snakeNotification()
        notificationSnakePosition.type = 'snakePosition'
        
        notificationSnakePosition.value = { 
            'position': this.position,
            'tail': this.tail,
            'player': this.name,
        }

        this.notifyAll(notificationSnakePosition)
    }

    inputHandler(notification){
        if(!notification || notification.type != 'input'){
            return
        }
        this.direction = notification.value
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

const snakeNotification = () => {
    return {
        'sender': 'Snake',
        'type':'',
        'value':''
    }
}

export { Snake }