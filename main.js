const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`logined ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content === 'kokoro') {
        msg.reply('主様~');
    }
});

bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'lobby');
    //let role = member.guild.roles.find(r => r.name === "佑樹");
    if (!channel) return;
    channel.send(`歡迎回來， ${member}阿魯機撒馬`);
    member.roles.add("731088928786087946");
});

bot.login(config.token);