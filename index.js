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
        event.reply(msg);
    }
    switch (event.message.type) {
        case 'text':
            replayMessage('我愛gordon')
        break;
    }

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
