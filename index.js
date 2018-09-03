const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("message", async message => {

  if(message.author.bot) return;
  

  if(message.content.indexOf(config.prefix) !== 0) return;
  
 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
	
  
  if(command === "ping") {
    
    const m = await message.channel.send("Pinging");
    m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
   if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
	  
    const sayMessage = args.join(" ");
   
    message.delete().catch(O_o=>{}); 
  
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
   
    if(!message.member.roles.some(r=>["Admin", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // kick
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
   // ban
    if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("Something went wrong, If this happens multiple times; DM Kacper");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
   
    const deleteCount = parseInt(args[0], 10);
    
   
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
   
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  
   if(command === "help") {
	   embed=discord.Embed(title="Help", description="You ask for help, I deliver it!")
embed.set_author(name="FaTaLz Bot")
embed.add_field(name="Ping", value="Get the server ping!", inline="False")
embed.add_field(name="Say", value="Replys with what you said", inline="True")
embed.add_field(name="Kick (ADMIN)", value="Kicks user", inline="True")
embed.add_field(name="Ban (ADMIN)", value="Bans a user", inline="True")
embed.set_footer(text="/help < Prefix / >")
await self.bot.say(embed=embed)
   }
});

client.login(config.token);
