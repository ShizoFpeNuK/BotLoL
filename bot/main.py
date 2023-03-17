import bot.events.bot_commands as bot_cmd
from settings.config import BOT_TOKEN
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('.env')
load_dotenv(dotenv_path=dotenv_path)


bot_cmd.start(BOT_TOKEN)
