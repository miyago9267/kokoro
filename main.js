import dotenv from 'dotenv';
import Bot from './src/models/bot.js';
const bot = new Bot();

dotenv.config();

bot.login(process.env.BOT_TOKEN);
