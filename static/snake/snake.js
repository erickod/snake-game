import SnakeDirectionStrategy from './snakeDirectionStrategy.js';
import snakeNotification from './snakeNotification.js'

class Snake {
    constructor(socket, snakeDirectionStrategy=SnakeDirectionStrategy){
        this.observers = []
        this.socket = socket
        this.snakeDirectionStrategy = snakeDirectionStrategy

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
        this.updatePositionOnBordRefresh(notification)
    }

    updatePositionOnBordRefresh(notification){
        if(notification.type != 'gameRefresh') return

        // save head position
        this.position.x = this.tail[0].x
        this.position.y = this.tail[0].y

        let directionStrategy = new this.snakeDirectionStrategy(this.direction)
        let updatedTail = directionStrategy.exec(this.position.x, this.position.y)
        
        //update snake tail  
        this.tail.pop()
        this.tail.unshift(updatedTail)

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

export { Snake }