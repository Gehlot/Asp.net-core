module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name:
        {
            type: type.STRING,
            notEmpty: true
        },
        password:
        {
            type:type.STRING,
        },
          admin:
          {
              type:type.BOOLEAN,
              defaultValue: false
          }
    })
}