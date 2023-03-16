import discord
import socketio
import os
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv('BOT_TOKEN')
BOT_PREFIX = os.getenv('BOT_PREFIX')
SERVER_URL = f'ws://{os.getenv("SERVER_ADDRESS")}:{os.getenv("SERVER_PORT")}'

sio_client = socketio.AsyncClient()

intents = discord.Intents.default()
intents.message_content = True

discord_bot = commands.Bot(command_prefix=BOT_PREFIX, intents=intents)
