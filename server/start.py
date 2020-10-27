import random

from aiohttp import web
import socketio

async def index(request):
    return web.FileResponse('index.html')

sio = socketio.AsyncServer()
app = web.Application()
app.router.add_get('/', index)
app.router.add_static('/static', 'static')
sio.attach(app)

state = {
        'velocity':100,
        'players':{},
        'fruits':{}
        }

stateNotification = {
            'sender': 'RemoteState',
            'type': 'state',
            'value':{
                'velocity':state['velocity'],
                'players':state['players'],
                'fruits':state['fruits']
            }
        }

@sio.event
async def connect(sid, environ):
    print(f'Client Connected: {sid}')

@sio.on('registerPlayer', namespace='/')
async def registerPlayer(sid, notification):
    if state['fruits'] == {}:
        await genarateRandomFruit(sid)

    player_object = notification['value']
    player_key = player_object['player']
    if player_key not in state['players'].keys() and player_key:
        state['players'][player_key] = player_object
        print(f'Registered player {player_key}')


@sio.on('snakePosition', namespace='/')
async def snakePositionHandler(sid, notification):
    #print(f'Player id ${sid} has been moved')
    #print(notification)
    if notification['type'] == 'snakePosition':
        player_object = notification['value']
        player_key = player_object['player']

        state['players'][player_key] = {**state['players'][player_key], **player_object}
        
        if player_key in state['players']:
            state['players'][player_key] = {**state['players'][player_key], **player_object}
            await verifyPlayerFruitColision(sid)
        else:
            await registerPlayer(sid, notification)

@sio.on('genarateRandomFruit', namespace='/')
async def genarateRandomFruit(sid):
    for _ in range(1):
        posX = random.randint(0,19)
        posY = random.randint(0,19)
        fruit = {
            'id': f'{posX}-{posY}',
            'x': posX,
            'y': posY,
        }
        state['fruits'][fruit['id']] = fruit
        print('> Generated new fruit')
        return fruit

@sio.on('verifyPlayerFruitColision', namespace='/')
async def verifyPlayerFruitColision(sid):

    for player_key in state['players'].keys():
        for fruit_id in state['fruits'].keys():
            player = state['players'][player_key]
            fruit = state['fruits'][fruit_id]
            if(player['position']['x'] == fruit['x'] and player['position']['y'] == fruit['y']):
                if 'score' not in player:
                    player['score'] = 1
                else:
                    player['score'] += 1
                await deleteFruit(sid, {'id':fruit_id})
                await genarateRandomFruit(sid)
                break

@sio.on('getState', namespace='/')
async def emitState(sid):
    notification = dict(stateNotification)
    await sio.emit('responseGetState', notification)

@sio.on('deleteFruit', namespace='/')
async def deleteFruit(sid, notification):
    #del state['fruits'][notification['id']]
    state['fruits'].pop(notification['id'])


    await sio.emit('responseGetState', notification)

@sio.on('playerDesconnection', namespace='/')
async def playerDisconnection(sid, notification):
    print(notification)

@sio.event
async def disconnect(sid):
    print(f'User disconnected {sid}')
    state['players'].pop(sid, None)
    await sio.emit('playerDesconnection', {'type':'playerDesconnection', 'value':sid})


if __name__ == '__main__':
    web.run_app(app)