import { Client, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


class Bot extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages,
                //   GatewayIntentBits.GuildVoiceStates,
            ],
            partials: [
              Partials.Channel,
              Partials.Message
            ]
        });

        this.prefix = '!';

        this.loadCogs();

        this.once('ready', () => {
            console.log(`Logged in as ${this.user.tag}`);
        });

        this.on('guildMemberAdd', member => {
            const channel = member.guild.systemChannel;
            //let role = member.guild.roles.find(r => r.name === config.defaultRole);
            if (!channel) return;
            channel.send(`お帰りなさい， ${member}主さま`);
        })

        this.on('guildCreate', server => {
            let emb = new Discord.MessageEmbed()
            .setTitle("ありがとうございました。");
            server.systemChannel.send("Kokoro desu");
        })
    }

    loadCogs = async () => {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const cogsPath = path.join(__dirname, '../cogs');
        const cogFiles = fs.readdirSync(cogsPath).filter(file => file.endsWith('.js'));

        for (const file of cogFiles) {
            const { default: Cog } = await import(path.join(cogsPath, file));
            const cogInstance = new Cog(this);
            console.log(`已載入功能模組：${file}`);
        }
    }

}

export default Bot;