from aiohttp import web
import socketio

from state import State


async def index(request):
    return web.FileResponse('index.html')

sio = socketio.AsyncServer()
app = web.Application()
app.router.add_get('/', index)
app.router.add_static('/static', 'static')
sio.attach(app)


state = State()

@sio.event
async def connect(sid, environ):
    print(f'Client Connected: {sid}')


@sio.on('addPlayer', namespace='/')
async def add_player(sid, player):
    print(f'Added player with id ${sid}')
    state.addPlayer(player)

@sio.on('movePlayer', namespace='/')
async def add_player(sid, player):
    print(f'Moving player id ${sid}')
    state.mover(player)

@sio.on('getState', namespace='/')
async def get_state(sid, player):
    print('sending state to the client id', sid)
    result = await state.getState()
    await sio.emit('getState', {'state': result})


if __name__ == '__main__':
    web.run_app(app)
