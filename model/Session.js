module.exports = function(sequelize, DataType) {
    var Session = sequelize.define('Session', {
        sessionKey: {
            type: DataType.STRING,
            field: 'sessionKey',
			allowNull: false
        }
    });

    return Session;
};