class SnakeDirectionStrategy{
    constructor(direction, callbackContainer=snakeDirection){
        this.direction = direction
        this.callbackContainer = callbackContainer
    }

    exec(x, y){{
        if(this.direction in this.callbackContainer){
            const callback = this.callbackContainer[this.direction]
            return callback(x, y)
        }
        return {x:x, y:y}
    }}
    
}

const snakeDirection = {
    left: (x, y) => {
        if(x <= 0 ){
            x = 19
            return {'x':19, 'y':y}
        }
        x = x - 1
        return {'x':x, 'y':y}
    },

    right: (x, y) => {
        if(x >= 19 ){
            x = 0
            return {'x':x, 'y':y}
        }
        x = x + 1
        return {'x':x, 'y':y}
    },

    up: (x, y) => {
        if(y <= 0 ){
            y = 19
            return {'x':x, 'y':y}
        }
        y = y - 1
        return {'x':x, 'y':y}
    },

    down:(x, y) => {
        if(y >= 19 ){
            y = 0
            return {'x':x, 'y':y}
        }
        y = y + 1
        return {'x':x, 'y':y}
        
    }
}

export default SnakeDirectionStrategy