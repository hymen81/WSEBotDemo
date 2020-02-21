var linebot = require('linebot');
var express = require('express');
var serveIndex = require('serve-index');
var file = require('fs');
var http = require('http');
var https = require('https');


var config = JSON.parse(file.readFileSync('config.config', 'utf8'));

var linebot_config = config.linebot_config;
var imgur_config = config.imgur_config;

var bot = linebot({
    channelId: linebot_config.channelId,
    channelSecret: linebot_config.channelSecret,
    channelAccessToken: linebot_config.channelAccessToken
});

bot.on('message', function (event) {

    console.log('groupID:' + event.source.groupId);
    console.log('userId:' + event.source.userId);
    console.log('message:' + event.message.text);
    
    function isContainsString(str) {
        return event.message.text.toLowerCase().indexOf(str) != -1;
    }

    function replyImage(url) {
        event.reply({
            type: 'image',
            originalContentUrl: url, 
            previewImageUrl: url
        }).then(function (success) {
            // success
        }).catch(function (error) {
            replayMessage('Error')
        });
    }

    function replyVideo(url) {
        event.reply({
            type: 'video',
            originalContentUrl: url,
            previewImageUrl: url
        });
    }

    function replayMessage(msg) {
        event.reply(msg).then(data => {
            // if reply success
            console.log('Reply: ', msg);
        }).catch(error => {
            // if something went wrong
            console.log('Error: ', error)
        });;
    }

    switch (event.message.type) {
        case 'text':
            replayMessage(event.message.text);
        break;
    }

});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log('Port :', port);
});
