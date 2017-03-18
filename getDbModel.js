var Sequelize = require("sequelize");
var sequelize = new Sequelize(null, null, null,{dialect: 'sqlite', storage: 'music.db'});
var Song = sequelize.import('./model/Song.js');
var Playlist = sequelize.import('./model/Playlist.js');
Playlist.belongsToMany(Song, {through: 'Songs_Playlists', as:'Songs_Playlists'});
Song.belongsToMany(Playlist, {through: 'Songs_Playlists', as:'Songs_Playlists'});
exports.Song = Song;
exports.Playlist = Playlist;