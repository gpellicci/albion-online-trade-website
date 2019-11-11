const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //console.log(client.guilds);
  //guild = client.guilds.first();		//pick 1st server
  guild = client.guilds.get("626104995225403403");
  console.log(guild.name + ` has `+ guild.memberCount + ` members.`);	//print server info
  members = guild.members.array();
  for (var k in members) {
    console.log(members[k].user.presence.status+`\t\t`+members[k].user.username+`#`+members[k].user.discriminator);		//print user info
    if(members[k].user.username==="Giacomo"){
    	//members[k].user.send("Hi bud! I'd like to buy you t8.1 excellent knight helmet for 300k silver");	//send dm to user
    }
  }

  const channel = guild.channels.find(ch => ch.name === 'general');
  //channel.sendMessage("Ready!");	//print msg in general chat
  //memberStatus(members);			//print online/dnd/away/offline status
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
    // If the message is "what is my avatar"
  if (msg.content === 'what is my avatar') {
    // Send the user's avatar URL
    msg.reply(msg.author.avatarURL);
  }
});

client.login('NjI2MDc0Mjk2NzA3NDQ4ODQ0.XZaAfw.247XxspME_tvnm_IBEBVeMFV_78');

function memberStatus(members){
	guild = client.guilds.first();
	const channel = guild.channels.find(ch => ch.name === 'general');
	channel.sendMessage("Members status\n\n");
	for (var k in members) {
    	channel.sendMessage(members[k].user.presence.status+`\t\t`+members[k].user.username+`#`+members[k].user.discriminator);
  }
}

// useful part ------------------------------------------------------------------------------

var express = require('express');
var https = require('https');
var fs = require('fs');
const path = require("path");
const cors = require('cors');
app = express();	//init express application
app.use(express.json()) // for parsing application/json
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'static')));







//application behavior
app.get('/', function(req,res) {
    res.send('hello');
});



app.post('/pog', (req, res) => {
	//use this to make a post request to url= http://localhost:50451/pog
	//sending as payload userId, whotoContact
	//let the bot tag one of them or whatever
  //console.log(req);
  console.log("req");
  console.log("-------------------");
	const channel = guild.channels.find(ch => ch.name === 'trade');	
  //console.log(channel);
	info = req.body;
	wtb = info.wtb;
  wtb_member = guild.members.find(m => m.id === wtb);

  wts = info.wts;
  wts_member = guild.members.find(m => m.id === wts);

  if(wts_member == null || wtb_member == null){
    if(wts_member == null){
      console.log("wts --- null -> not on this server. value ["+wts_member+"]");
      res.status(400).send({ error: 'bad request' });
    }
    else if(wtb_member == null){
      console.log("wtb --- null -> not on this server. value ["+wtb_member+"]");
      res.status(400).send({ error: 'bad request' });
    }
  }
  else{
    console.log("wtb: "+wtb+"    wts: "+wts+"  ||  Item: **T" + info.tier + "." + info.enchant + "** "+ mapQuality(info.quality) + " " + info.item);
    string = "<@" + wtb + ">  WTB from  <@"+wts+"> !   ||||  Item: **T" + info.tier + "." + info.enchant + "** "+ mapQuality(info.quality) + " " + info.item;
  	channel.send(string);	//print msg in general chat
  	//memberStatus(members);			//print online/dnd/away/offline status  	
  	console.log(info.item);
  	res.status(200).send("success");
  	console.log("-------------------");
  }
});


// Routes
app.use('/api/discord', require('./api/discord'));

app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});




// https server-----------------------------------------------------------------------------

//load certificate stuff
var options = {
  ca: fs.readFileSync(path.resolve(__dirname, 'ssl.chain/server.chain')),
  cert: fs.readFileSync(path.resolve(__dirname, 'ssl.crt/server.crt')),
  key: fs.readFileSync(path.resolve(__dirname, 'ssl.key/server.key'))
};

//startup https server
var server = https.createServer(options, app);
server.listen(50451, function(){
    console.log("server running at https://albion-trade.com:50451/");
    
});











// utility functions -----------------------------------------------------------------------------

function mapQuality(quality){
  if(quality==1)
    return "Normal";
  else if(quality==2)
    return "Good";
  else if(quality==3)
    return "Outstanding";
  else if(quality==4)
    return "Excellent";
  else if(quality==5)
    return "Masterpiece";
}
