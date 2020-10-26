class Fruit {
    observers = []
    fruits = {}

    constructor(){
    }

    genarateRandomFruit(notification){
        if(!notification) notification = {type:'getNewFruit'}
        
        if(notification.type == 'getNewFruit'){
            const fruitX = Math.floor(Math.random() * 20)
            const fruitY = Math.floor(Math.random() * 20)

            const fruit = {
                x: fruitY,
                y: fruitX,
                id: `${fruitX}-${fruitY}`
            }

            this.fruits[fruit.id] = fruit
            notification = fruitNotification()
            notification.type = 'fruitGeneration'
            notification.value = fruit
            this.notifyAll(notification)
        }
    }

    deleteFruit(notification){
        if(notification.type == 'deleteFruit'){
            delete this.fruits[notification.value.id]
        }
    }

    subscribe(subject){
        subject.attach(this)
    }

    unsubscribe(subject){
        subject.dettach(this)
    }

    update(notification){
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

const fruitNotification = () => {
    return {
        sender: 'Fruit',
        type:'',
        value:''
    }
}

export { Fruit };