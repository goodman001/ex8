var Sequelize = require("sequelize");
var sequelize = new Sequelize(null, null, null,{dialect: 'sqlite', storage: 'music.db'});
var Song = sequelize.import('./model/Song.js');
var Playlist = sequelize.import('./model/Playlist.js');
var User = sequelize.import('./model/User.js');
var Session = sequelize.import('./model/Session.js');
Playlist.belongsToMany(Song, {through: 'Songs_Playlists', as:'Songs_Playlists'});
Song.belongsToMany(Playlist, {through: 'Songs_Playlists', as:'Songs_Playlists'});
User.belongsToMany(Playlist, {through: 'Users_Playlists', as:'Users_Playlists'});
Playlist.belongsToMany(User, {through: 'Users_Playlists', as:'Users_Playlists'});

Session.belongsTo(User, {as: 'sessionUser'});
exports.Song = Song;
exports.Playlist = Playlist;
exports.User = User;
exports.Session = Session;