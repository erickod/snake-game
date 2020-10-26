class State:
    def __init__(self) -> None:

        self.velocity = 1000/20
        self.players = dict()
        self.fruits = dict()

    def addPlayer(self, notification):
       player_object = notification['player']
       self.players[player_object['name']] = player_object
    
    def movePlayer(self, notification):
        player_object = notification['player']
        self.players[player_object['name']] = player_object

        print(notification)
    
    async def getState(self, ):
        state = {
            'velocity':self.velocity,
            'players':self.players,
            'fruits':self.fruits
        }

        return state

