//https://github.com/tediousjs/node-mssql#connections-1
//https://www.dotnetcurry.com/nodejs/1238/connect-sql-server-nodejs-mssql-package
//https://stackoverflow.com/questions/30356148/how-can-i-use-a-single-mssql-connection-pool-across-several-routes-in-an-express
//https://github.com/paigen11/mySqlRegistration
//https://github.com/mirkojotic/node-sequelize-article
"use strict";
var fs = require('fs');
var util = require('util');
var sql = require('mssql');

var environments = {
    "local": {
        allowOrigin: 'http://localhost:3000',
        writeLog: true,
        conn: {
            user: 'parksql1907',
            password: 'tyam12mT!*EE',
            server: '23.101.171.29',
            database: 'Parkimon'
        }
    },
    "prod": {

    }
};

// Connection string parameters.
var config = {
    user: 'parksql1907',
    password: 'tyam12mT!*EE',
    server: '23.101.171.29',
    database: 'Parkimon'
};
// const poolPromise = new sql.ConnectionPool(config)
//     .connect()
//     .then(pool => {
//         console.log('Connected to MSSQL')
//         return pool
//     })
//     .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
    sql,
    //poolPromise
}
var log_file = fs.createWriteStream(process.cwd() + '/logs/sequelize.log', {
    flags: 'w'
});

var sqlLog = function (logData) {
    console.log(logData);
    log_file.write(util.format(logData) + '\n');
};



module.exports = {
    currentEnvioment: environments.prod,
    setCurrentEnviorment: function (enviormentName) {
        this.currentEnvioment = environments[enviormentName];
        return this.currentEnvioment;
    },
    getCurrentEnviorment: function () {
        return this.currentEnvioment;
    },
    //poolPromise

};