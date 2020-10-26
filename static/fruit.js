class Fruit {
    observers = []
    fruits = {}

    constructor(){
    }

    genarateRandomFruit(){
        const fruitX = Math.floor(Math.random() * 20)
        const fruitY = Math.floor(Math.random() * 20)

        const fruit = {
            x: fruitY,
            y: fruitX,
            id: `${fruitX}-${fruitY}`
        }
        this.fruits[fruit.id] = fruit

        const notification = fruitNotification()
        notification.type = 'fruitGeneration'
        notification.value = fruit
        this.notifyAll(notification)
    }

    subscribe(subject){
        subject.attach(this)
    }

    unsubscribe(subject){
        subject.dettach(this)
    }

    update(notification){
        if(!notification){
            return
        }

        if(notification.type == 'getNewFruit'){
            this.genarateRandomFruit()
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
}

const fruitNotification = () => {
    return {
        sender: 'Fruit',
        type:'',
        value:''
    }
}

export { Fruit };