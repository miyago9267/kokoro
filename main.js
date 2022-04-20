const Discord = require('discord.js');
const cmdList = require('./cmdList.json');
const config = require("./config.json");
const response = require("./response.json");
const { NONAME } = require('dns');
const bot = new Discord.Client();
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class kkr {
    constructor () {
        this.server = "Not set yet";
        this.channel = "Not set yet";
        this.mode = "Off";
        this.channelName = "Not set yet";
        this.serverName = "Not set yet";
    }

    setMode (msg, args) {
        this.mode = args[2];
        msg.channel.send("Mode has been set to " + this.mode);
    }

    setServer (msg, args){
        this.server = args[2];
        this.serverName = bot.guilds.cache.get(this.server).name;
        msg.channel.send("Server has been set to " + this.serverName);
    }

    setChannel (msg, args){
        this.channel = args[2];
        this.channelName = bot.channels.cache.get(this.channel).name
        msg.channel.send("Channel has been set to " + this.channelName)
    }

    getStatus (msg){
        let emb = new Discord.MessageEmbed()
        .setTitle("Owner Command Status")
        .setDescription("**How can i do for u**\n\n")
        .addField("Server: ", this.serverName)
        .addField("Channel: ", this.channelName)
        .addField("Mode: ", this.mode);
        msg.channel.send(emb);
    }

    setOff (msg, args) {
        this.mode = "Off"
    }

    send (msg, args) {
        if (msg.content.startsWith(config.prefix)) return;
        if (this.mode != "send") return;
        bot.channels.cache.get(this.channel).send(msg.content);
        msg.channel.send("Message has been sent to " + this.channelName);
    }

    serverCommand (msg) {
        if (msg.content.startsWith(config.prefix)) {
            let args = msg.content.split(" ");
            if (!cmdList[args[1]]) return;
            this[cmdList[args[1]]](msg, args);
        }
        else {
            if (response[msg])
                msg.channel.send(response[msg])
        }
    }

    privateCommand (msg) {
        if (msg.content.startsWith(config.prefix)) {
            let args = msg.content.split(" ");
            if (!cmdList[args[1]]) return;
            this[cmdList[args[1]]](msg, args);
        }
        else {
            if (!cmdList[this.mode]) return;
            let text = msg.content;
            this[cmdList[this.mode]](msg, text);
        }
        
    }
}

const kokoro = new kkr();

bot.on('ready', () => {
    console.log(`${bot.user.tag} is now login!`);
});

bot.on('message', msg => {
    try {
        if (msg.author.bot) return;
        if (!msg.guild){
            if (msg.author.id == config.botOwner) kokoro.privateCommand(msg);
            else return;
        } 
        else {
            kokoro.serverCommand(msg);
        }
    } catch (err) {
        return console.log(err);
    }
    
});

bot.on('guildMemberAdd', member => {
    const channel = member.guild.systemChannel;
    //let role = member.guild.roles.find(r => r.name === config.defaultRole);
    if (!channel) return;
    channel.send(`お帰りなさい， ${member}主さま`);
});

bot.on('guildCreate', server => {
    let emb = new Discord.MessageEmbed()
    .setTitle("ありがとうございました。");
    server.systemChannel.send("Kokoro desu");
})

bot.login(config.token);
