module.exports = function(sequelize, DataType) {
    var Song = sequelize.define('Song', {
        album: {
            type: DataType.STRING,
            field: 'album',
            allowNull: true
        },
        title: {
            type: DataType.STRING,
            field: 'title',
            allowNull: true
        },
        artist: {
            type: DataType.STRING,
            field: 'artist',
            allowNull: true
        },
        duration: {
            type: DataType.INTEGER,
            field: 'duration',
            allowNull: true
        }
    });

    return Song;
};
