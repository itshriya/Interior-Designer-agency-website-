from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
MONGO_URL = "mongodb+srv://livora_db_user:livora@cluster0.yx2ur5c.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URL)

db = client["livora"]