import bot.connection.get

from bot.settings.config import sio_client
from socketio.exceptions import ConnectionError


async def start(url):
    try:
        await sio_client.connect(url)
    except ConnectionError:
        await start(url)
    await sio_client.wait()


async def register_client(nickname, client_id, channel_id):
    if type(nickname) is not str:
        nickname = ' '.join(nickname)

    client_info = client_info_to_json(channel_id, client_id)
    client_info['summonerName'] = nickname
    await sio_client.emit('registerClient', client_info)


async def enable_tracking(client_id, channel_id):
    await sio_client.emit('enableTrackingPlayer', client_info_to_json(channel_id, client_id))


async def disable_tracking(client_id, channel_id):
    await sio_client.emit('disableTrackingPlayer', client_info_to_json(channel_id, client_id))


def client_info_to_json(channel, client):
    return {
        'clientId': str(client),
        'channelId': str(channel)
    }
