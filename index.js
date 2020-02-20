var linebot = require('linebot');
var express = require('express');
var serveIndex = require('serve-index');
var file = require('fs');
var http = require('http');


var config = JSON.parse(file.readFileSync('config.config', 'utf8'));

var linebot_config = config.linebot_config;
var imgur_config = config.imgur_config;

var bot = linebot({
    channelId: linebot_config.channelId,
    channelSecret: linebot_config.channelSecret,
    channelAccessToken: linebot_config.channelAccessToken
});

var imgur_list = [];

// linebot message event
bot.on('message', function (event) {
    var userInput = event.message.text;
    var botReply = '你剛剛說了: ' + userInput;

    // reply to user
    event.reply(botReply).then(data => {
        // if reply success
        console.log('Reply: ', message);
    }).catch(error => {
        // if something went wrong
        console.log('Error: ', error)
    });
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


/*app.get('/test', function (req, res) {
    console.log('groupID:');
    res.send('test');
});

app.use(express.static('public'));
//Serves all the request which includes /images in the url from Images folder
app.use('/node_modules', express.static(__dirname + '/node_modules'), serveIndex('node_modules', {'icons': true}));
*/
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log('Port :', port);
});
