var express = require('express');
var router = express.Router();
var sql = require('mssql');
var fs = require('fs')
var multiparty = require('multiparty');
const jwt = require('jsonwebtoken');
const {
    User,
    Blog,
    Tag
} = require("../../sequelize");

// with query
router.get('/users', (req, res) => {

    User.findOne({
        where: {
            emailId: req.body.emailId,
            password: req.body.password
        },

    }).then(user => {
        if (user != null) {
            let token = jwt.sign({
                username: req.body.emailId
            }, 'keyboard cat 4 ever', {
                expiresIn: 60 * 60
            });
            reqResHandler.sendSuccessResponse(req, res, 'SUCCESS_RECORDS', {
                token
            });
        }
        else{
         reqResHandler.sendSuccessResponse(req, res, 'No user found', {
            
         });
        }
    }).finally(() => {

    });

    // // let check username and password 
    // let token = jwt.sign({
    //     id: "user.id",
    //     username: "user.username"
    // }, 'keyboard cat 4 ever', {
    //     expiresIn: 129600
    // });
    // console.log("token", token);
    // User.findAll().then(users => {
    //     reqResHandler.sendSuccessResponse(req, res, 'SUCCESS_RECORDS', {
    //         users,
    //         token
    //     });
    // }).catch(function (err) {
    //     console.log("error", err);
    // });;
});
router.post('/adduser', (req, res) => {
    User.create(req.body)
        .then(user => reqResHandler.sendSuccessResponse(req, res, 'SUCCESS_RECORDS', user))
})
// with query
// router.get('/users', async (req, res) => {
//     console.log("req", req.body);
//     var respData = {
//         data: []
//     };
//     var pool = await sqlConnection;
//     await pool.request().query('select * from Employee', function (err, recordset) {
//         if (err) {
//             reqResHandler.sendErrorResponse(req, res, 400, "No users found");
//             sql.close();
//             return;
//         }
//         respData['data'] = recordset.recordsets;
//         reqResHandler.sendSuccessResponse(req, res, 'SUCCESS_RECORDS', respData);
//         sql.close();
//     });
// });

// //With Procedure 


// router.get('/roles', async (req, res) => {
//     sql.close();
//     var respData = {
//         data: []
//     };
//     sql.connect(currentServerEnv.conn, function (err) {
//         if (err) console.log(err);
//         var request = new sql.Request();
//         //  request.input("name", sql.NVarChar(50), "admin")
//         //.
//         request.execute("spemployee").
//         then(function (recordSet) {
//             respData['data'] = recordSet.recordsets;
//             reqResHandler.sendSuccessResponse(req, res, 'SUCCESS_RECORDS', respData);
//             sql.close();
//         }).catch(function (err) {
//             console.log(err);
//             sql.close();
//         }).then(function () {
//             var data = respData.data[0];
//             data.forEach(function (item, i) {
//                 console.log(item.Name);
//             });

//         });
//     });
// });

// router.get('/amount', async (req, res) => {
//     sql.close();
//     var respPaymentData;
//     var respBookingData;
//     var finalrespData = {
//         data: []
//     };
//     sql.connect(currentServerEnv.conn, function (err) {
//         if (err) console.log(err);
//         var request = new sql.Request();
//         request.query("select top 1 amount from PaymentTransactionDetail").
//         then(function (recordSet) {
//             respPaymentData = recordSet.recordsets[0];
//         }).catch(function (err) {
//             console.log(err);
//             sql.close();
//         }).then(function () {
//             request.query("select top 1 max(amount) as amount from ConsumerBooking").
//             then(function (recordSet) {
//                 respBookingData = recordSet.recordsets[0];
//                 finalrespData['data'] = respPaymentData[0].amount + respBookingData[0].amount;
//                 reqResHandler.sendSuccessResponse(req, res, 'SUCCESS_RECORDS', finalrespData);
//                 sql.close();
//             }).catch(function (err) {
//                 console.log(err);
//                 sql.close();
//             })
//         });
//     });
// });


// router.post('/upload', function (req, res) {


//     var form = new multiparty.Form();

//     form.parse(req, function (err, fields, files) {
//         var imgArray = files.imatges;


//         for (var i = 0; i < imgArray.length; i++) {
//             console.log("imgArray", imgArray[i].originalFilename);
//             var newPath = './public/';
//             var singleImg = imgArray[i];
//             newPath += singleImg.originalFilename;
//             readAndWriteFile(singleImg, newPath);
//         }
//         res.send("File uploaded to: " + newPath);

//     });

//     function readAndWriteFile(singleImg, newPath) {

//         fs.readFile(singleImg.path, function (err, data) {
//             fs.writeFile(newPath, data, function (err) {
//                 if (err) console.log('ERRRRRR!! :' + err);
//                 console.log('Fitxer: ' + singleImg.originalFilename + ' - ' + newPath);
//             })
//         })
//     }
// })

module.exports = router;