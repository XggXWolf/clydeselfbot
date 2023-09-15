const { Client } = require('discord.js-selfbot-v13');
const { readFileSync, writeFileSync } = require('fs');
require('dotenv').config();

const client = new Client({
  checkUpdate: false
});

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
})

const config = JSON.parse(readFileSync('config.json'))





client.login(process.env['TOKEN']);

let waitmsg
let waitchannel

client.on('messageCreate', async message => {

  const clydezone = '1151852527843811389'
  const splittedmsg = message.content.split(' ')
  if ((message.guild && config.allowedGuilds.includes(message.guild.id)) || config.allowedChannels.includes(message.channel.id))

    if (splittedmsg[0] == ("<@Your selfbot's user id here>")) {
      client.channels.cache.get(clydezone).send(removeFirstWord(message.content))
      waitmsg = message.id
      waitchannel = client.channels.cache.get(message.channel.id)
    }



  if (message.channel.id == clydezone && message.author.id == '1081004946872352958') {
    try {
      const testmsg = await waitchannel.messages.fetch(waitmsg)
      waitchannel.messages.fetch(waitmsg).reply({
        content: message.content,
        allowedMentions: { repliedUser: false }
      });

    } catch (error) {
      console.error('Error fetching message:', error);
    }
  }


  if (message.content.split(' ')[0].toLowerCase() == '#addguild') {
    if (message.author.id == process.env["ADMIN"]) {
      if (message.guild && !config.allowedGuilds.includes(message.guild.id)) {
        config.allowedGuilds.push(message.guild.id)
        writeFileSync('config.json', JSON.stringify(config, null, 2))
        const success = await message.channel.send('Added guild to allowlist')
        setTimeout(() => success.delete(), 5000);
      } else if (message.guild && config.allowedGuilds.includes(message.guild.id)) { message.channel.send("This guild is in already allowlist") } else if (!message.guild) { message.channel.send("You're not in a guild") }
    } else {
      message.channel.send('This command is for admin only')
    }
  }

  if (message.content.split(' ')[0].toLowerCase() == '#addchannel') {
    if (message.author.id == process.env["ADMIN"]) {
      if (message.channel && !config.allowedChannels.includes(message.channel.id)) {
        config.allowedChannels.push(message.channel.id)
        writeFileSync('config.json', JSON.stringify(config, null, 2))
        const success = await message.channel.send('Added Channel to allowlist')
        setTimeout(() => success.delete(), 5000);
      } else if (message.channel && config.allowedChannels.includes(message.channel.id)) { message.channel.send("This channel is already in allowlist") } else if (!message.channel) { console.log("Error channel not found") }
    } else {
      message.channel.send('This command is for admin only')
    }
  }

  if (message.content.split(' ')[0].toLowerCase() == '#removeguild') {
    if (message.author.id == process.env["ADMIN"]) {
      if (message.guild && config.allowedGuilds.includes(message.guild.id)) {
        const index = config.allowedGuilds.indexOf(message.guild.id);
        config.allowedGuilds.splice(index, 1);
        writeFileSync('config.json', JSON.stringify(config, null, 2));
        const success = await message.channel.send('Removed guild from allowlist');
        setTimeout(() => success.delete(), 5000);
      } else if (message.guild && !config.allowedGuilds.includes(message.guild.id)) {
        message.channel.send("This guild is not in the allowlist");
      } else if (!message.guild) {
        message.channel.send("You're not in a guild");
      }
    } else {
      message.channel.send('This command is for admin only');
    }
  }

  if (message.content.split(' ')[0].toLowerCase() == '#removechannel') {
    if (message.author.id == process.env["ADMIN"]) {
      if (message.channel && config.allowedChannels.includes(message.channel.id)) {
        const index = config.allowedChannels.indexOf(message.channel.id);
        config.allowedChannels.splice(index, 1);
        writeFileSync('config.json', JSON.stringify(config, null, 2));
        const success = await message.channel.send('Removed channel from allowlist');
        setTimeout(() => success.delete(), 5000);
      } else if (message.channel && !config.allowedChannels.includes(message.channel.id)) {
        message.channel.send("This channel is not in the allowlist");
      } else if (!message.channel) {
        console.log("Error channel not found");
      }
    } else {
      message.channel.send('This command is for admin only');
    }
  }

});


function removeFirstWord(inputString) {
  let words = inputString.split(' ');

  words = words.slice(1);
  let resultString = words.join(' ');

  return resultString;
}
