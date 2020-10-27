import random

class State:
    def __init__(self) -> None:

        self.velocity = 1000/20
        self.players = dict()
        self.fruits = dict()

    async def registerPlayer(self, notification):
        player_object = notification['value']
        player_key = player_object['player']
        if player_key not in self.players.keys():
            self.players[player_key] = player_object
            print(f'Registered player {player_key}')
    
    async def snakePositionHandler(self, notification):

        if notification['type'] == 'snakePosition':
            player_object = notification['value']
            player_key = player_object['player']
            if player_key in self.players:
                self.players[player_key] = {**self.players[player_key], **player_object}
            else:
                await self.registerPlayer(notification)
    
    async def genarateRandomFruit(self, num=1):
        for _ in range(num + 1):
            posX = random.randint(0,19)
            posY = random.randint(0,19)
            fruit = {
                'id': f'{posX}-{posY}',
                'x': posX,
                'y': posY,
            }
            self.fruits[fruit['id']] = fruit
            return fruit
    
    async def deleteFruit(self, fruit):
        del self.fruits[fruit['id']]
    

    async def getState(self):
        state = {
            'sender': 'RemoteState',
            'type': 'state',
            'value':{
                'velocity':self.velocity,
                'players':self.players,
                'fruits':self.fruits
            }
        }

        return state

