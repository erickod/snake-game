from random import randint


class StateManager:
    def __init__(self) -> None:

        self.velocity = 1000/20
        self.players = dict({})
        self.fruits = [{
            "x":randint(0,19),
            "y":randint(0,19)
        }]

    def addPlayer(self, sid):
        player_x = int(randint(0, 19))
        player_y = int(randint(0, 19))

        self.players[sid] = {
                    "id": sid,
                    "name": "teste",
                    "x": player_x,
                    "y": player_y,
                    "tail": [{
                        "x":player_x,
                        "y":player_y,
                    }],
                }
    
    def removePlayer(self, notification):
       player_object = notification['player']
       del self.players[player_object['id']]
    
    def movePlayer(self, notification):
        player_object = notification['player']
        self.players[player_object['id']] = player_object
        self.handeFruitColision()

    def handeFruitColision(self):
        for id in self.players.keys():
            player = self.players[id]
            if {'x':player["x"], 'y':player["y"]} == self.fruits[0]:
                player["tail"].append(dict(self.fruits[0]))
                self.generateRandomFruit()
            
    def generateRandomFruit(self):
        self.fruits[0] = {
            "x":randint(0,19),
            "y":randint(0,19)
        }
    
    
    async def getState(self, ):
        state = {
            'velocity':self.velocity,
            'players':self.players,
            'fruits':self.fruits
        }

        return state

