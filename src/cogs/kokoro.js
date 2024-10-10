import { EmbedBuilder } from 'discord.js';

class Kokoro {
    constructor (bot) {
        this.bot = bot;

        this.botOwner = process.env.BOT_OWNER;
        this.guild = ''
        this.channel = ''
        this.guildName
        this.channelName

        this.messageMap = new Map();

        this.bot.on('messageCreate', async (ctx) => {
            if (ctx.author.bot) return;
            if (ctx.content.startsWith(this.bot.prefix + "kokoro")) {
                let args = ctx.content.split(" ");
                if (args[1] == "setChannel") this.setChannel(ctx, args.slice(2));
                else if (args[1] == "getStatus") this.getStatus(ctx);
            }
            else if (!ctx.guild && ctx.author.id == this.botOwner) this.send(ctx);
            else if (ctx.guild && ctx.channel.id == this.channel) {
                this.messageHandler(ctx);
            }
            return;
        });

        this.bot.on('messageDelete', async (ctx) => {
            if (ctx.author.bot) return;
            if (!ctx.guild && ctx.author.id == this.botOwner) {
                this.deleteMessage(ctx);
            }
        });
    }

    setChannel = async (ctx, args) => {
        this.channel = args[0];
        await this.bot.channels.fetch(this.channel)
        .then(channel => {
            this.guildName = channel.guild.name
            this.channelName = channel.name
        })
        await ctx.channel.send("Channel has been set to " + this.guildName + " - " +  this.channelName)
    }

    getStatus = async (ctx) => {
        let embed = new EmbedBuilder()
            .setTitle("狀態檢視")
            .setURL("https://example.com")
            .setDescription("可可蘿是你媽")
            .addFields(
                {
                name: "`伺服器`",
                value: this.guildName,
                inline: false
                },
                {
                name: "`頻道`:",
                value: this.channelName,
                inline: true
                },
            )
            .setColor("#00b0f4")
            .setFooter({
                text: "你媽",
                iconURL: "https://slate.dan.onl/slate.png",
            })
            .setTimestamp();

        await ctx.reply({ embeds: [embed] });
    }

    send = async (ctx) => {
        if (this.channel == '') {
            await ctx.channel.send("Please set channel first using " + this.bot.prefix + "kokoro setChannel <channelID>");
            return;
        }

        let channel = await this.bot.channels.fetch(this.channel);
        let message = await channel.send(ctx.content);
        this.messageMap.set(ctx.id, message.id);
    }

    messageHandler = async (ctx) => {
        this.bot.users.fetch(this.botOwner)
        .then(user => {
            user.send(`\`${ctx.author.displayName}\`` + " : " + ctx.content)
        })
    }

    deleteMessage = async (ctx) => {
        if (this.messageMap.has(ctx.id)) {
            let messageID = this.messageMap.get(ctx.id);
            let channel = await this.bot.channels.fetch(this.channel);
            let message = await channel.messages.fetch(messageID);
            await message.delete();
            this.messageMap.delete(ctx.id);
        }
    }
}

export default Kokoro;