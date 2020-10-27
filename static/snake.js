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

    applyId(notification){
        if(notification.type == 'playerId' && this.name === ''){
            this.name = notification.value
            const socket = notification.socket
            this.registerUser(socket)
        }
    }

    registerUser(socket){
        console.log('registerUser')
        const notification = snakeNotification()
        notification.type = 'registerPlayer'
        notification.value = {
            player: this.name, 
            position: this.position,
            tail: this.tail,
            score: this.score
        }
        
        socket.emit(notification.type, notification)
        this.notifyAll(notification)
    }

    subscribe(subject){
        subject.attach(this)
    }

    unsubscribe(subject){
        subject.dettach(this)
    }

    update(notification){
        this.applyId(notification)
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
            position: this.position,
            tail: this.tail,
            player: this.name,
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
        sender: 'Snake',
        type:'',
        value:''
    }
}

export { Snake }