![](https://images.hdqwalls.com/wallpapers/wall-e-eve-minimal-4k-je.jpg)

# EVE-Bot
EVE is the only bot that you need in your discord server, it comes with many features such as a Giveaway System, Application System and much more
- Released: 15.08.2022
- [💌 Invite the bot](https://discord.com/api/oauth2/authorize?client_id=1009480009821474936&permissions=8&scope=bot%20applications.commands)
<p align="center">
	<a href="https://dsc.gg/gokimax">
		<img src="https://canary.discordapp.com/api/guilds/999373116918743100/embed.png" alt="Discord server">
	</a>
</p>

## Commands

[Click here to see all command categories](./src/types/commands/)

## Installation

1. Start cloning the repository and installing the dependencies.
```bash
git clone https://github.com/gokiimax/EVE-Bot.git
cd EVE-Bot
npm install
```
2. Make sure you installed [ffmpeg](https://ffmpeg.org/) (for the music system)
3. Create a free [MongoDB Database](https://www.mongodb.com/) , [Tutorial Here](https://www.youtube.com/watch?v=Amlh956Xn0I)

Free Mongodb Url
```bash
mongodb+srv://oddcoder:public@cluster0.qp2djfl.mongodb.net/?retryWrites=true&w=majority
```
4. Edit your config.json file to your preferences, Create a token on the [Discord Developer Portal](https://discord.com/developers/applications)
### Config:
```json
{
    "token": "DISCORD TOKEN",
    "color": "#34a6ef",
    "developerGuild": "GUILD ID",
    "database": "MongoDB Url",
    "supportServer": "DISCORD Invite Link",
    "activityInterval": 10,
    "activities": [
            "/invite | dsc.gg/eve-bot",
	    "/help | {servercount} servers"
    ]
}
```
5. If you finished to configurate, you can start the bot
```bash
npm run start
```
## Hosting Setup

### Glitch
You can use Glitch too for this project, featured with its code editor.

1. Star and fork this project
2. Go to [glitch.com](https://glitch.com) and make an account
3. Click **New Project** then **Import from GitHub**, specify the pop-up field with `https://github.com/<your-name>/EVE-Bot` (without `<>`)
4. Please wait for a while, this process takes some minutes
5. Find `.env` file and delete it
6. After specifying `config.json`, open **Terminal**
7. Copy and paste ```
npm install -g npm@latest
                  ```Into Your Terminal
8. Type `refresh`, and track the process from **Logs**

<a href="https://glitch.com/edit/#!/import/github/Clytage/rawon"><img src="https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg" alt="Remix on Glitch"></a>


## Author
[gokimax](https://github.com/gokiimax)
[GDMgmer3992](https://github.com/GDMgmer3992)

## ☕️ Support & Socials
My Bot is open source and free to use. If you found any of my repos useful and would like to support my projects, feel free to follow me.


[![TikTok Link](https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white)](https://tiktok.com/@maxii.x6)
[![Twitter Link](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/gokimax_x)
[![Youtube Link](https://img.shields.io/badge/YOUTUBE-E4405F?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@gokimax)
