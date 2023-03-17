from bot.settings.config import sio_client
from bot.events.server_answers import *


@sio_client.event
async def connectBot(data):
    print(data)


@sio_client.event
async def connect_error(data):
    print('The connection failed!')
    print(f'Info: {data}')


@sio_client.event
async def disconnect():
    print('Disconnected!')


@sio_client.event
async def isNickname(data):
    channel_id, client_id = client_info_to_param(data)
    result = data['isNickname']
    nickname = data['summonerName']
    await register_answer(result, channel_id, client_id, nickname)


@sio_client.event
async def clientRegistered(data):
    channel_id, client_id = client_info_to_param(data)
    nickname = data['summonerName']
    await already_register(channel_id, client_id, nickname)


@sio_client.event
async def summonerResultPlayedMatch(data):
    channel_id, client_id = client_info_to_param(data)
    win = data['win']
    await last_match(win, channel_id, client_id)


@sio_client.event
async def playerAlreadyTracked(data):
    channel_id, client_id = client_info_to_param(data)
    res = data['isTracked']
    await already_tracked(res, channel_id, client_id)


@sio_client.event
async def clientNoRegistered(data):
    channel_id, client_id = client_info_to_param(data)
    await no_register(channel_id, client_id)


@sio_client.event
async def playerNoTracked(data):
    channel_id, client_id = client_info_to_param(data)
    await no_tracked(channel_id, client_id)


def client_info_to_param(data):
    channel_id = int(data['channelId'])
    client_id = int(data['clientId'])
    return channel_id, client_id
