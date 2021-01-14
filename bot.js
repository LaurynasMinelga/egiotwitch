const tmi = require('tmi.js');
const creds = require('./creds.js');
const express = require('express');

const app = express()
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    res.render('index')
})
app.listen(5656, () => {
    console.log('http://localhost:5656')
})

/**
 * =================================================================
 *                  THIS IS BOT 
 * =================================================================
 */
// Define configuration options (bot is using real account)
const opts = {
    identity: {
        username: creds.username,
        password: creds.password
    },
        channels: creds.channels
};

// Create a client with our options (client is an object)
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler); // this one catches every message as separate object.
client.on('connected', onConnectedHandler); // this one catches event of connecting to our account.

// Connect to Twitch:
client.connect();

// Called every time a message comes in (EVERY MESSAGE creates new loop)
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message (ex.: [   labas  ] -> [labas])
  const commandName = msg.trim();

//Timeout command (Where magic happens)
if (context["custom-reward-id"] === creds.reward1){

    // delete '@' symbol
    var name = commandName.slice(1);

    //timeout command that executes (target - channel, name - username, 300 - time in seconds, 'text')
    client.timeout(target, name, 300, `Was hammered by ${context["display-name"]}`)
    .then((data) => {
        // returns success message to console
        console.log(`timeout successful on ${name}`);
    }).catch((err) => {
        // logs error to console
        console.log(err);
    });
}

// This is just an example of other commands and how they work
if (commandName === '!zjbs') {
    client.say(target, `Hi, I am bot and You can suk my robot dik :)`);
    console.log(`* Executed ${commandName} command`);
} 
  // THe command to roll the dice
if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  }
}
// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

