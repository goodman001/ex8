// var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();


var Song = require('./getDbModel.js').Song
var Playlist = require('./getDbModel.js').Playlist;


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}));

var getAppHttp = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Cache-Control','max-age=1800');
    fs.readFile(__dirname + '/playlist.html', function(err, data) {
        response.end(data);
    });
};

var getAPISongs = function(request, response){
  response.statusCode = 200;
  response.setHeader('Content-Type','application/json');
  response.setHeader('Cache-Control','max-age=1800');
  Song.findAll({raw: true}).then(function(song) {
    var arr = new Array();
    for(var i=0;i<song.length;i++){
      arr[i] = {"album": song[i]["album"],
                "duration": song[i]["duration"],
                "title": song[i]["title"],
                "id": song[i].id-1,
                "artist": song[i]["artist"]
               };
    }
    var dic = new Array();
    dic= {'songs':arr};
    console.log(dic.toString());
    response.end(JSON.stringify(dic));
  });
  /*fs.readFile(__dirname + '/songs.json',function(err,data){
      response.end(data);
  });*/
  // console.log("Responded Songs API");
};
/*
var playtest = function(request,response){
  response.statusCode = 200;
  response.setHeader('Content-Type','application/json');
  response.setHeader('Cache-Control','max-age=1800');
  Playlist.findAll({raw: true}).then(function(playlist) {
    var dic = new Array();
    dic= {'playlists':playlist};
    console.log(dic.toString());
    response.end(JSON.stringify(dic));
  });
  //console.log("Responded Songs API");
  //console.log(response);
  // console.log("responded API playlist");
};*/
var getAPIPlaylists = function(request,response){
  response.statusCode = 200;
  response.setHeader('Content-Type','application/json');
  response.setHeader('Cache-Control','max-age=1800');
  var bigdata = new Array();
  var tt = new Array();
  //var cell='';
  Playlist.findAll().then(function(playlist) {
    //var dic = new Array();
    //dic['playlists'] = playlist;
    //console.log(dic.toString());
    //response.end(dic.toString());
    bigdata = playlist;
    
    for(var i=0;i<playlist.length;i++){
      //console.log(playlist[i]);
      var tmp = new Array();
      //tmp = {""}
      var cell = playlist[i];
      Promise.all([
                  playlist[i],
                  cell
                ]).then(function(results){
                  var player = results[0];
                  var cell = results[1];
                  player.getSongs_Playlists({raw: true}).then(function(re){
                    var arr = [];
                    //console.log(cell);
                    for(var z=0;z<re.length;z++)
                    {
                      arr[z] = re[z]['Songs_Playlists.SongId'] - 1;
                    }
  
                    tmp = {'id':cell.dataValues.id-1,'name':cell.dataValues.name,'songs':arr};
                    tt.push(tmp);
                   
                    if(tt.length == bigdata.length)
                    {
                      var dic = new Array();
                      dic= {'playlists':tt};
                      //console.log(dic.toString());
                      response.end(JSON.stringify(dic));
                      
                    }
                  });
                  
                  //console.log(JSON.stringify(player));
                });
    }
  })
};



var getAppStylesheet = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css');
    response.setHeader('Cache-Control','max-age=1800');
    fs.readFile(__dirname + '/playlist.css', function(err, data) {
        response.end(data);
    });
};
var getMusicAppJS = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');
    response.setHeader('Cache-Control','max-age=1800');
    fs.readFile(__dirname + '/music-app.js', function(err, data) {
        response.end(data);
    });
};
var getMusicDataJS = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');
    response.setHeader('Cache-Control','max-age=1800');
    fs.readFile(__dirname + '/music-data.js', function(err, data) {
        response.end(data);
    });
};

// var app = http.createServer(function(request, response){
//     console.log(request.url);
//     if (request.url === '/' && request.method === 'GET') {
//         getAppHttp(request, response);
//     } else if (request.url === '/playlist.css') {
//         getAppStylesheet(request, response);
//     } else if (request.url === '/music-app.js') {
//         getMusicAppJS(request, response);
//     } else if (request.url === '/music-data.js') {
//         getMusicDataJS(request, response);
//     } else if (request.url === '/api/songs') {
//         getAPISongs(request,response);
//     } else if (request.url === '/api/playlists') {
//         getAPIPlaylists(request,response);
//     }
//       else {
//         console.log("wtf");
//     }
// });
app.get(['/library','/playlists','/search'],getAppHttp);
app.get('/',function(req,res){
  res.statusCode = 200;
  res.redirect('/playlists');
});
app.get('/playlist.css',getAppStylesheet);
app.get('/music-app.js',getMusicAppJS);
app.get('/api/songs',getAPISongs);
app.get('/api/playlists',getAPIPlaylists);
app.get('/covers/:coverNum.png',function(req,res){
  res.statusCode = 200;
  res.setHeader('Cache-Control','max-age=1800');
  fs.readFile(__dirname + '/covers/' + req.params['coverNum'] + '.png', function(err, data) {
      res.end(data);
  });
});
app.get('/favicon.ico',function(req,res){
  res.statusCode = 200;
  res.setHeader('Content-Type','image/x-icon');
  res.setHeader('Cache-Control','max-age=1800');
  fs.readFile(__dirname + '/favicon.ico',function(err,data){
    res.end(data);
  });
});
app.post('/api/playlists/',function(req,res){
  if (req.body['name'] !== undefined) {
    var name = req.body['name'];
    console.log(name);
    // TODO: use ORM to update database!
    Playlist.create({name:name}).then(function(){
      Playlist.findOne({'where':{ 'name':name },raw: true}).then(function(user){
        console.log(user);
        //user.getAddress();
        //res.set('Content-Type', 'text/html; charset=utf-8');
        //es.end(JSON.stringify(user.id));
        var ansewer = new Array();
        ansewer = {'id':user.id,'name':user.name,'songs':[]};
        res.send(JSON.stringify(ansewer));
      });
    
    
    });
    
    
    
  }
});
app.post('/api/playlists/:id',function(req,res){
  if (req.params.id !== undefined) {
    var songID = parseInt(req.body['song']) + 1 ;
    var playlistID = parseInt(req.params.id) + 1 ;
    Playlist.findById(playlistID).then(function(target){
      if(target != null)
      {
        Song.findById(songID).then(function(ss){
          if(ss == null)
          {
            res.send("songID " + songID + " does not exist!");
          }else
          {
            //console.log(target);
            Promise.all([
              target,
              ss
            ]).then(function(results){
              var player = results[0];
              var songcell = results[1];
              player.addSongs_Playlists(songcell);
            });
            res.send('Added to the playlist!');
          }
          
        });
        
      }else
      {
        res.send("playlistID " + playlistID + " does not exist!");
      }
      
      
    });
    //TODO:ORM add songID to playlist
    //res.send('Added to the playlist!');
    //console.log("post req adding song "+songID+" to playlist "+playlistID);
  }
});
/*del*/
app.post('/playlists/:id',function(req,res){
  if (req.params.id !== undefined) 
  {
    var songID = parseInt(req.body['song']) + 1 ;
    var playlistID = parseInt(req.params.id) + 1 ;
    Playlist.findById(playlistID).then(function(target){
      if(target != null)
      {
        Song.findById(songID).then(function(ss){
          if(ss == null)
          {
            res.send("songID " + songID + " does not exist!");
          }else
          {
            Promise.all([
              target,
              ss
            ]).then(function(results){
              var player = results[0];
              var songcell = results[1];
              player.removeSongs_Playlists(songcell);
            });
            res.send("delete "+ songID +" from playlist ID:" + songID);
          }
          
        });
      }else
      {
        res.send("playlistID " + playlistID + " does not exist!");
      }
      
      
    });
    //res.send("delete playlist ID:" + songID);
  }
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000! Open and accepting connections until someone kills this process');
})
