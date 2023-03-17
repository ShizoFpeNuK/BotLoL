from bot.settings.config import discord_bot


@discord_bot.event
async def register_answer(res, channel_id, client_id, nickname):
    channel = discord_bot.get_channel(channel_id)
    if res:
        await channel.send(f'<@{client_id}>, Вы зарегистрированы под **{nickname}**.')
    else:
        await channel.send(f'<@{client_id}>, Пользователя **{nickname}** не существует!')


@discord_bot.event
async def already_register(channel_id, client_id, nickname):
    channel = discord_bot.get_channel(channel_id)
    await channel.send(f'<@{client_id}>, Вы уже зарегистрированы под **{nickname}**.')


@discord_bot.event
async def last_match(win, channel_id, client_id):
    channel = discord_bot.get_channel(channel_id)
    await channel.send(f'<@{client_id}>, {win}.')


@discord_bot.event
async def already_tracked(res, channel_id, client_id):
    channel = discord_bot.get_channel(channel_id)
    if not res:
        await channel.send(f'<@{client_id}>, Вы теперь на прослушке!')
    else:
        await channel.send(f'<@{client_id}>, Вы уже стоите на прослушке!')


@discord_bot.event
async def no_register(channel_id, client_id):
    channel = discord_bot.get_channel(channel_id)
    await channel.send(f'<@{client_id}>, Вы не зарегистрированы в системе отслежки!')


@discord_bot.event
async def no_tracked(channel_id, client_id):
    channel = discord_bot.get_channel(channel_id)
    await channel.send(f'<@{client_id}>, Вас больше не отслеживают! :grinning:')
