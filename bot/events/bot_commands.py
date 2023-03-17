import bot.connection.send as send_to
from bot.settings.config import discord_bot, SERVER_URL


def start(token):
    discord_bot.run(token)


@discord_bot.event
async def on_ready():
    print(f'We have logged in as {discord_bot.user}')
    await send_to.start(SERVER_URL)


@discord_bot.command()
async def register(ctx, *nickname):
    author_id = ctx.message.author.id
    channel_id = ctx.message.channel.id
    if nickname is not None:
        await send_to.register_client(nickname, author_id, channel_id)
    else:
        await ctx.send('ПНХ')


@discord_bot.command()
async def enable(ctx):
    channel_id = ctx.message.channel.id
    author_id = ctx.message.author.id
    await send_to.enable_tracking(author_id, channel_id)


@discord_bot.command()
async def disable(ctx):
    channel_id = ctx.message.channel.id
    author_id = ctx.message.author.id
    await send_to.disable_tracking(author_id, channel_id)
