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


@sio.on('registerPlayer', namespace='/')
async def registerPlayer(sid, notification):
    await state.registerPlayer(notification)


@sio.on('snakePosition', namespace='/')
async def snakePositionHandler(sid, notification):
    #print(f'Player id ${sid} has been moved')
    await state.snakePositionHandler(notification)

@sio.on('getState', namespace='/')
async def emitState(sid):
    await sio.emit('getState', await state.getState())

@sio.on('genarateRandomFruit', namespace='/')
async def genarateRandomFruit(sid):
    await sio.emit('genarateRandomFruit', await state.genarateRandomFruit())


@sio.on('deleteFruit', namespace='/')
async def genarateRandomFruit(sid, notification):
    await sio.emit('genarateRandomFruit', await state.deleteFruit(notification))




if __name__ == '__main__':
    web.run_app(app)
