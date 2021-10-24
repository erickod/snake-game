from aiohttp import web
import socketio

from state import StateManager


async def index(request):
    return web.FileResponse('index.html')

sio = socketio.AsyncServer()
app = web.Application()
app.router.add_get('/', index)
app.router.add_static('/static', 'static')
sio.attach(app)


state_manager = StateManager()

@sio.event
async def connect(sid, environ):
    print(f'Client Connected: {sid}')
    state_manager.addPlayer(sid)
    await sio.emit('updateState', await state_manager.getState())

@sio.event
async def disconnect(sid, **kwargs):
    print(f'Disconnected {sid}')
    state_manager.removePlayer({
        'player': {
            'id': sid
        }
    })
    await sio.emit('updateState', await state_manager.getState())


@sio.on('addPlayer', namespace='/')
async def add_player(sid, notificacion):
    print(f'Added player with id ${sid}')
    state_manager.addPlayer(notificacion)

@sio.on('movePlayer', namespace='/')
async def move_player(sid, notification):
    #print(f'Moving player id ${sid}')
    if notification["player"].get('id'):
        state_manager.movePlayer(notification)
        #await sio.emit('updateState', await state_manager.getState())

@sio.on('getState', namespace='/')
async def get_state_manager(sid):
    #print('Sending updated state_manager to all')
    await sio.emit('updateState', await state_manager.getState())

@sio.on('updateState', namespace='/')
async def update_state_manager(sid):
    #print('sending updated state_manager to the client id', sid)
    result = await state_manager.getState()
    #await sio.emit('getState', {'state_manager': result})

@sio.on('generateFruit', namespace='/')
async def generate_fruit(sid):
    #print('sending updated state_manager to the client id', sid)
    result = await state_manager.getState()
    #await sio.emit('getState', {'state_manager': result})



if __name__ == '__main__':
    web.run_app(app)
