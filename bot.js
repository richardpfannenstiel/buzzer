const { Client } = require('discord.js');
const config = require('./config.json');

const client = new Client();

var buzzerPressed = false;

/*
    EVENT: Bot logs into the Discord Server.
 */
client.on('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}!`);
});

/*
    EVENT: Player creates a buzzer
 */
client.on('message', message => {
    if (message.content.toLowerCase() === '/buzzer') {
        if (message.channel.type !== 'text') { // Abort if the channel is a direct message channel.
            message.reply('You can only create a buzzer in text channels.');
            return
        }
        message.delete();
        message.channel.send('Buzzer 🔔');
        console.log(`>> ${message.author.tag} just created a buzzer.`)
    }
});

client.on('message', message => {
    if (message.author.bot) {
        if (message.content === 'Buzzer 🔔') {
            message.react(config.buzzer.emoji) // Create buzzer reaction.
                .catch(err => console.error);
        }
    }
});

/*
    EVENT: Player presses the buzzer
 */
client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return;
    if (!reaction.emoji.name === config.buzzer.name) return;

    reaction.users.remove(user);
    if (buzzerPressed) {
        user.send('Unfortunately too slow! Somebody already pressed the buzzer 😤.');
        return;
    }
    buzzerPressed = true;

    reaction.message.channel.send(`💡 **${user.username}** hit the buzzer!`);
    console.log(`${user.username} hit the buzzer!`);
    setTimeout(() => {
        reaction.message.channel.send('５');
    }, 1000);
    setTimeout(() => {
        reaction.message.channel.send('４');
    }, 2000);
    setTimeout(() => {
        reaction.message.channel.send('３');
    }, 3000);
    setTimeout(() => {
        reaction.message.channel.send('２');
    }, 4000);
    setTimeout(() => {
        reaction.message.channel.send('１');
    }, 5000);
    setTimeout(() => {
        reaction.message.channel.send('Over 🏁');
    }, 6000)
});

/*
    Delete the countdown messages.
 */
client.on('message', message => {
    if (message.author.bot) {
        if (message.content !== 'Buzzer 🔔') {
            setTimeout(() => {
                message.delete();
                buzzerPressed = false;
            }, 15000)
        }
    }
});

client.login(config.botToken);