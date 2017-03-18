"use strict";

var fs        = require("fs");
var path      = require("path");
fs.exists('music.db', function( exists ){
    if(exists == true)
    {
      fs.unlink('music.db', function(){
       console.log('del music.db success') ;
       }) ;
      
    }
 });
var Sequelize = require("sequelize");
var sequelize = new Sequelize(null, null, null,{dialect: 'sqlite', storage: 'music.db'});

var db = {};

//console.log(__dirname);
/*fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname +'/model/', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
*/
var Song = sequelize.import('./model/Song.js');
var Playlist = sequelize.import('./model/Playlist.js');
var User = sequelize.import('./model/User.js');

Playlist.belongsToMany(Song, {through: 'Songs_Playlists', as:'Songs_Playlists'});
Song.belongsToMany(Playlist, {through: 'Songs_Playlists', as:'Songs_Playlists'});

User.belongsToMany(Playlist, {through: 'Users_Playlists', as:'Users_Playlists'});
Playlist.belongsToMany(User, {through: 'Users_Playlists', as:'Users_Playlists'});
//sequelize.sync();
var tmp = new Array();
sequelize.sync().then(function() {
  // here comes your find command.
  /*create user*/
  //User.create({username:'Foo',password:'123'});
  //User.create({username:'Bar',password:'456'}); 
    var flags;
  fs.readFile(__dirname + '/json/playlists.json',function(err,data){
      var obj0 = JSON.parse(data);
      for(var i=0;i<obj0['playlists'].length;i++)
      {
        //console.log(obj['playlists'][i].id);
        Playlist.create({name:obj0['playlists'][i].name}).then(function(target){
            if(target.dataValues.name=="90's Mega Mix"){
               //console.log(target);
               User.create({username:'Foo',password:'123'}).then(function(data){
                      //console.log(data);
                      Promise.all([
                        target,
                        data
                      ]).then(function(results){
                        var player = results[0];
                        var usercell = results[1];
                        usercell.addUsers_Playlists(player);
                        return
                      });
                      return;
                    });
           }else if(target.dataValues.name=="Workout Tracks")
           {
               User.create({username:'Bar',password:'456'}).then(function(data){
                      //console.log(datas);
                      Promise.all([
                        target,
                        data
                      ]).then(function(results){
                        var player = results[0];
                        var usercell = results[1];
                        player.addUsers_Playlists(usercell);
                      });
                    });
           }
           /*else if(target.dataValues.name=="Daft Punk mix")
           {
               User.findOne({username:'Bar'}).then(function(data){
                      console.log(data);
                      Promise.all([
                        target,
                        data
                      ]).then(function(results){
                        var player = results[0];
                        var usercell = results[1];
                        player.addUsers_Playlists(usercell);
                      });
                    });
           }*/
        
        });
        
          
          
          
        tmp = obj0;
      }
      
      /*
      ADD USER TO RELATION TABLE
      */
      fs.readFile(__dirname + '/json/songs.json',function(err,data){
          var obj = JSON.parse(data);
          for(var i=0;i<obj['songs'].length;i++)
          {
            //console.log(obj['songs'][i]);
            Song.create({album:obj['songs'][i].album,title:obj['songs'][i].title,artist:obj['songs'][i].artist,duration:obj['songs'][i].duration});
          }
          for(var j=0;j<obj0['playlists'].length;++j)
          {
            Playlist.findById(obj0['playlists'][j].id +1).then(function(target){ 
              //var trans = JSON.parse(target);
              //console.log(target.dataValues.id);
              for(var z = 0;z<tmp['playlists'].length;z++)
              {
                if((tmp['playlists'][z].id + 1) == target.dataValues.id)
                {
                  //console.log(tmp['playlists'][z]['songs']);
                  if(target.dataValues.name=="Daft Punk mix")
                  {
                      
                  User.findOne({where: {username:'Bar'}}).then(function(data){
                      console.log("###########");
                      console.log(data);
                      Promise.all([
                        target,
                        data
                      ]).then(function(results){
                        var player = results[0];
                        var usercell = results[1];
                        player.addUsers_Playlists(usercell);
                      });
                    });
                  }
                  for(var k = 0;k<tmp['playlists'][z]['songs'].length;k++){
                    Song.findById(tmp['playlists'][z]['songs'][k]+1).then(function(datas){
                      //console.log(datas);
                      Promise.all([
                        target,
                        datas
                      ]).then(function(results){
                        var player = results[0];
                        var songcell = results[1];
                        player.addSongs_Playlists(songcell);
                      });
                    });
                  }
                }
                
              }
             
            });
          }
      });
      //console.log(obj['playlists'][0]['id']);
  });
  
 
})

exports.Song = Song;
exports.Playlist = Playlist;
exports.User = User;





/**/