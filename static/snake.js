class Snake {
    position = {
        x:null,
        y:null
    };

    direction = ['left', 'right', 'up','down'][Math.floor(Math.random() * 4)];
    score = 0;
    tail = [
        { 
            x:Math.floor(Math.random() * 20), 
            y:Math.floor(Math.random() * 20),
        },
    ]

    subscrite(subject){
        subject.attach(this)
    }

    unsubscrite(subject){
        subject.dettach(this)
    }

    update(notification){
       this.inputHandler(notification)
    }

    inputHandler(notification){
        if(notification.type != 'input'){
            return
        }
        this.direction = notification.value
    }
}

export { Snake }