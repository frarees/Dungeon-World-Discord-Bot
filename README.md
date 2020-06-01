# Dungeon World Discord Bot

A bot designed to streamline Dungeon World play on a Discord server. The bot allows players to create functional in-chat character sheets to record their stats, and deploys those stats for simple rolls or basic DW moves. Each of the basic DW moves is called with a simple command which rolls 2d6, applies the appropriate stat, and returns the level of success along with the related text. Though it is not intended to fully replace traditional character sheets, this bot lets you focus more on your game and less on referencing the text.

### Support

Althought this project was a labor of love, it was still labor. If you'd like to support this and future projects, please consider [leaving a tip](https://www.paypal.me/minibradford). Thanks for your support!

## For Discord Users

To add the Dungeon World Bot to your Discord server, click this [link](https://discord.com/api/oauth2/authorize?client_id=712847626386669568&permissions=0&scope=bot). Once the bot is logged in, type `?menu` in the chat to access the in-chat menu.

### Commands

Once the bot is logged in, `?menu` or `!menu` will take you to the in-chat menu. It lists all bot commands. In general, commands can be looked up with the prefix `?` and used with the prefix `!`

 * `!newcharacter` - Use this command to create a new blank character or to zero out your character stats. Each player must create their own character. Sometimes creating a new blank character sheet will be necessary for updates in the bot to be visible.
 * `!character` - Enter this command at any time to check on your character stats.
 * `!set stat+value` - To set your character stats, enter the command `!set` followed by all the STAT MODIFIERS you want to set. Use the stat name +/- stat value. Unentered stats will default to zero or their existing value. If you enter `name+nickname` it will enter your Disord Channel nickname.  
 Example: `!set name+bambino str+1 wis+2 cha-1 ... etc`
 * `!shift stat+value` - Use this command to change your character stats by a certain amount. This is useful if you want to subtract from your hp, or when leveling up. The stat will shift up or down by the value amount.
 Example: `!shift hp-5` will remove 5 from your character's current hp.
 * `!roll xdy +z` - Use the format !roll xdy +z where x = number of die, y = faces on die, and z = positive or negative modifier, if any. You can also enter the stat name as a modifier and it will use your stat value.
 EXAMPLE: `!roll 2d6 +1` OR `!roll 2d6 +wis`
 * `!defy +stat` - To defy danger type the command plus the chosen stat.
 Example: `!defy +wis`
 * `!hack`, `!volley`, `!defend`, `!spout`, `!discern`, `!parley` - The basic DW moves automatically roll a 2d6 and add the relevant stat from your character sheet.
 * Some all-class advanced moves are also programmed into the bot, and can be found in the in-chat menu. Advanced moves may take a stat, a number, or nothing as a modifier.
 * Anything not programmed as a bot move can be dealt with using a `!roll` command.

 * Additional moves may be added in future versions!


## For Developers

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To develop or run this bot locally, you will need to install [node.js](https://nodejs.org/en/download/), discord.js, dotenv, redis, and redis-jsonify. 

```
npm install discord.js
npm install dotenv
npm install redis
npm install redis-jsonify
```
Setting up redis takes a bit of terminal work, but you can follow the [documentation](https://redis.io/topics/quickstart).

For development purposes it's also useful to `npm install nodemon` so your bot will restart and log in each time you save your code.

### Installing

Once you've got the project file from github, you'll need to make a few changes.

First you'll need to set up a bot with Discord and create your own bot token.
* I found it very helpful to follow the instructions to [Create a Discord bot in under 15 minutes](https://thomlom.dev/create-a-discord-bot-under-15-minutes/).

Once you have your folder set up, dependencies installed, and your bot token, you need to put your token into the code. Create a hidden .env file in the root folder.

```
touch .env
```

And type the following into your new .env file (replace 'token' with your secret token):

```
BOT_TOKEN='token'
```

You'll also need to go into the redis.js file and remove the contents of the function createClient so it reads:

```
const save = jsonify(redis.createClient());

```

Continue to follow the Discord bot [instructions](https://thomlom.dev/create-a-discord-bot-under-15-minutes/) up through "Refactoring the Code" and your bot should be ready to run on your local machine.

Read on to learn how to deploy the bot on Heroku.

## Deployment

Follow the [instructions](https://thomlom.dev/create-a-discord-bot-under-15-minutes/) in the "Deploy" section to get started with Heroku. You'll need to do a few additional things to use Redis on Heroku.

Replace the code in the redis.js file:
```
const save = jsonify(redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true}));
```

In "Resources", make sure you've changed your Dyno from "web" to "worker".
You'll also need to add [Redis Cloud](https://devcenter.heroku.com/articles/rediscloud) as an add-on to your Heroku deployment. It requires you to add your credit card number to Heroku, but the first 30mb per month are free, so you should never get charged.

In "Settings", you need to create a new Config Var with the key as `BOT-TOKEN` and the value as your secret bot token.

## Built With

* [node.js](https://nodejs.org/en/download/) - The web framework used
* [discord.js](https://discordjs.guide/preparations/#installing-node-js) - Dependency Management
* [redis](https://www.npmjs.com/package/redis) - Used to generate RSS Feeds
* [redis-jsonify](https://www.npmjs.com/package/redis-jsonify) - 
* [Heroku](heroku.com) - 
* [Redis Cloud](https://devcenter.heroku.com/articles/rediscloud) - 

## Acknowledgments

Special thanks to the friends and developers who insptired and helped me:
* https://github.com/brandonjackson
* https://github.com/dyerw
* https://github.com/evanfeenstra
* https://github.com/TheSamLloyd