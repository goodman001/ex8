// var http = require('http');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();


var Song = require('./getDbModel.js').Song
var Playlist = require('./getDbModel.js').Playlist;
var User = require('./getDbModel.js').User;
var Session = require('./getDbModel.js').Session;
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser());
var generateKey = function(){
  var sha  = crypto.createHash('sha256');
  sha.update(Math.random().toString());
  return sha.digest('hex');
};
var checkSession = function(sessionKey){
  if(sessionKey == undefined)
  {
    return null;
  }else{
      console.log(sessionKey);
      Session.findOne({'where':{ 'sessionKey':sessionKey},raw: true}).then(function(res){
        console.log(res);
        return res.sessionUserId;
      });
  }
};
var getAppHttp = function(request, response) {
    
    var sessionKey = request.cookies.sessionKey;
    if(sessionKey != null && sessionKey !=undefined)
    {
        Session.findOne({'where':{ 'sessionKey':sessionKey},raw: true}).then(function(res){
          console.log(res);
          if(res != null){
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.setHeader('Cache-Control','max-age=1800');
            fs.readFile(__dirname + '/view/playlist.html', function(err, data) {
              response.end(data);
            });
          }else
          {
            response.setHeader('Content-Type', 'text/html');
            response.setHeader('Cache-Control','max-age=1800');
            response.statusCode = 401;
            //response.end("hahah");
            response.redirect('/login');
          }
          
        });
        
    }else
    {
      response.setHeader('Content-Type', 'text/html');
      response.setHeader('Cache-Control','max-age=1800');
      response.statusCode = 401;
      //resquest.end("hahah");
      response.redirect('/login');
    }
    
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
  var sessionKey = request.cookies.sessionKey;
    if(sessionKey != null && sessionKey !=undefined)
    {
        Session.findOne({'where':{ 'sessionKey':sessionKey},raw: true}).then(function(res){
          if(res != null){
            User.findOne({'where':{ 'id':res.sessionUserId}}).then(function(userinfo){
              Promise.all([
                userinfo
              ]).then(function(results){
                var user = results[0];
                user.getUsers_Playlists({raw: true}).then(function(rr){
                  var playlistid = [];
                  for(var i=0;i<rr.length;i++){
                    playlistid.push(rr[i].id);
                  }
                  Playlist.findAll({'where':{ 'id':playlistid}}).then(function(playlist) {
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
                                      console.log(dic);
                                      response.end(JSON.stringify(dic));

                                    }
                                  });

                                  //console.log(JSON.stringify(player));
                                });
                    }
                                    
                                    
                                    
                  });
                });
              });

              
           });
            
          }else
          {
            
          }
          
        });
    }else
    {
      response.setHeader('Content-Type', 'text/html');
      response.setHeader('Cache-Control','max-age=1800');
      response.statusCode = 401;
      //resquest.end("hahah");
      response.redirect('/login');
    }
  
};



var getAppStylesheet = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css');
    response.setHeader('Cache-Control','max-age=1800');
    fs.readFile(__dirname + '/css/playlist.css', function(err, data) {
        response.end(data);
    });
};
var getAppLoginStylesheet = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css');
    response.setHeader('Cache-Control','max-age=1800');
    fs.readFile(__dirname + '/css/login.css', function(err, data) {
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
app.get('/login.css',getAppLoginStylesheet);//login css
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
app.post('/api/playlists/:id',function(req,response){
  if (req.params.id !== undefined) {
    var songID = parseInt(req.body['song']) + 1 ;
    var playlistID = parseInt(req.params.id) + 1 ;
  
    var sessionKey = req.cookies.sessionKey;
    if(sessionKey != null && sessionKey !=undefined)
    {
        Session.findOne({'where':{ 'sessionKey':sessionKey},raw: true}).then(function(res){
          //console.log(res);
          if(res != null){
            User.findOne({'where':{ 'id':res.sessionUserId}}).then(function(userinfo){
                Promise.all([
                  userinfo
                ]).then(function(results){
                  var user = results[0];
                  user.getUsers_Playlists({raw: true}).then(function(rr){
                    var pflag = 0;
                    for(var i=0;i<rr.length;i++){
                      if(rr[i].id == playlistID)
                      {
                        pflag =1;
                        break;
                      }
                    }
                    if(pflag ==1){
                      Playlist.findById(playlistID).then(function(target){
                        if(target != null)
                        {
                          Song.findById(songID).then(function(ss){
                            if(ss == null)
                            {
                              response.send("songID " + songID + " does not exist!");
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
                              response.send('Added to the playlist!');
                            }

                          });

                        }else
                        {
                          response.send("playlistID " + playlistID + " does not exist!");
                        }


                      });
                    }else
                    {
                      response.setHeader('Content-Type', 'text/html');
                      response.setHeader('Cache-Control','max-age=1800');
                      response.statusCode = 403;
                      response.sendStatus(403);
                      //response.redirect('/login');
                    }
                    
                  });

                });
            });
            
          }else
          {
            response.setHeader('Content-Type', 'text/html');
            response.setHeader('Cache-Control','max-age=1800');
            response.statusCode = 403;
            response.sendStatus(403)
            //response.redirect('/login');
          }

        });

    }else
    {
      response.setHeader('Content-Type', 'text/html');
      response.setHeader('Cache-Control','max-age=1800');
      response.statusCode = 403;
      response.send(403);
      //resquest.end("hahah");
    }
  }
  
});
/*del*/
app.post('/playlists/:id',function(req,response){
  if (req.params.id !== undefined) 
  {
    var songID = parseInt(req.body['song']) + 1 ;
    var playlistID = parseInt(req.params.id) + 1 ;
    var sessionKey = req.cookies.sessionKey;
    if(sessionKey != null && sessionKey !=undefined)
    {
        Session.findOne({'where':{ 'sessionKey':sessionKey},raw: true}).then(function(res){
          //console.log(res);
          if(res != null){
            User.findOne({'where':{ 'id':res.sessionUserId}}).then(function(userinfo){
                Promise.all([
                  userinfo
                ]).then(function(results){
                  var user = results[0];
                  user.getUsers_Playlists({raw: true}).then(function(rr){
                    var pflag = 0;
                    for(var i=0;i<rr.length;i++){
                      if(rr[i].id == playlistID)
                      {
                        pflag =1;
                        break;
                      }
                    }
                    if(pflag ==1){
                      Playlist.findById(playlistID).then(function(target){
                        if(target != null)
                        {
                          Song.findById(songID).then(function(ss){
                            if(ss == null)
                            {
                              response.send("songID " + songID + " does not exist!");
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
                              response.send("delete "+ songID +" from playlist ID:" + songID);
                            }

                          });
                        }else
                        {
                          response.send("playlistID " + playlistID + " does not exist!");
                        }


                      });
                    }else
                    {
                      response.setHeader('Content-Type', 'text/html');
                      response.setHeader('Cache-Control','max-age=1800');
                      response.statusCode = 403;
                      response.sendStatus(403);
                      //response.redirect('/login');
                    }
                    
                  });

                });
            });
            
          }else
          {
            response.setHeader('Content-Type', 'text/html');
            response.setHeader('Cache-Control','max-age=1800');
            response.statusCode = 403;
            response.sendStatus(403)
            //response.redirect('/login');
          }

        });

    }else
    {
      response.setHeader('Content-Type', 'text/html');
      response.setHeader('Cache-Control','max-age=1800');
      response.statusCode = 403;
      response.send(403);
      //resquest.end("hahah");
    }
    
    
    
    
    
    
    
  }else
  {
    response.send("playlistID " + playlistID + " does not exist!");
  }
  
  
  
  
});
/*login page*/
app.get('/login/', function(request, response) {
  
    response.status(200).sendFile(path.join(__dirname, '/view/login.html'))
});
/*post login*/
app.post('/login/',function(req,resquest){
  var username = req.body['username'];
  var password = req.body['password'];
  console.log(password);
      // TODO: use ORM to update database!
      User.findOne({'where':{ 'username':username},raw: true}).then(function(user){
        console.log(user);
        bcrypt.compare(password, user.password, function(err, res) {
          if(res) {
            /*set session*/
            var key = generateKey();
            Session.create({sessionKey:key,sessionUserId:user.id});
            //console.log(res);
            resquest.statusCode = 301;
            resquest.set('Set-Cookie', 'sessionKey=' + key);            
            resquest.redirect('/playlists');
          } else {
            resquest.statusCode = 401;
            resquest.end("");
            //resquest.redirect('/login');
           // Passwords don't match
          } 
        });
      });
  // Store hash in database
    
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000! Open and accepting connections until someone kills this process');
})
