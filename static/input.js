const inputNotification = (pressedKey) => {
    const allowedInputs = {}
    allowedInputs['ArrowLeft'] = 'left'
    allowedInputs['ArrowUp'] = 'up'
    allowedInputs['ArrowRight'] = 'right'
    allowedInputs['ArrowDown'] = 'down'

    return {
        type:'input',
        value: allowedInputs[pressedKey]
    }
}



class InputHandler {
    observers = []

    constructor() {
        document.addEventListener('keydown', (e, context=this) => {
            this.inputFilter(e, context)
        })
    }

    inputFilter(e, context){
        if ([37,38,39,40].includes(e.keyCode)){
            const notification = inputNotification(e.key)
            this.notifyAll(notification)
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

export { InputHandler }
