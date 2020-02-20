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

var imgur_list = [];

getImageListFromImgur();

function getImageListFromImgur() {
    for (var i = 0; i < 1; i++) {
        var options = {
            hostname: imgur_config.host_name,
            path: imgur_config.path + i,
            headers: imgur_config.headers,
            method: imgur_config.method
        };
        var req = https.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                var obj = JSON.parse(body.toString());
                console.log(obj.data.length);
                imgur_list = imgur_list.concat(obj.data);
            });
        });
        req.end();
    }
}

function getRandom() {
    return Math.floor((Math.random() * imgur_list.length));
}

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
            //replayMessage('i love gordon');
            if (isContainsString('抽')) {
                    return replyImage(imgur_list[getRandom()].link);
            }
            else
                return replayMessage('i love gordon');
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
