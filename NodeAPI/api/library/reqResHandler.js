"use strict";

/**
 * @doc JiraRecurringTask
 * @name JiraRecurringTask.library:reqResHandler
 * @description A wrapper to manage all Request & response
 * This wrapper's methods are directly used to validate every request, it's authenticity and to generate response accordingly.
 * Every request on entry point will be rotated via this wrapper.
 *
 */
var promise = require("promise");
const jwt = require('jsonwebtoken');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(process.cwd() + '/logs/debug.log', {
	flags: 'w'
});
var error_log_file = fs.createWriteStream(process.cwd() + '/logs/error.log', {
	flags: 'w'
});
var codes = require(process.cwd() + '/api/strings/codes.js');
var message = require(process.cwd() + '/api/strings/messages.js');
var utils = require(process.cwd() + '/api/helper/utils.js');


var self = {

	validateRequest: function (req, res, next) {
		//In CORS, a preflight request with the OPTIONS method is sent, so that the server can respond whether it is acceptable to send the request with these parameters. 
		if (req.method.toLowerCase() == 'options') {
			self.sendSuccessResponse(req, res, "OPTION_REQUEST");
			return;
		}
		var url = req.path.replace(/\/$/, "");
		var endPoint = url.substring(url.lastIndexOf('/') + 1);
		var urlParts = url.split('/');
		// var nonSecureApiPaths = ['signin', 'signup'];
		var nonSecureApiPaths = ['users'];
		//API Key & Token validation for Application
		if (req.path.indexOf('api') != -1) {
			{
				if (req.headers['x-api-token']) {
					if ((nonSecureApiPaths.indexOf(endPoint) != -1 || nonSecureApiPaths.indexOf(urlParts[(urlParts.length - 1)])) && !req.headers['x-api-token']) {
						next();
					} else {
						console.log("req.headers['x-api-token']", req.headers['x-api-token']);
						var token = req.headers['x-api-token'] ? req.headers['x-api-token'] : "";
						if (token != "") {
							self.verifyToken(token).then(function (tokenStatus) {
								console.log("tokenStatus", tokenStatus);
								if (tokenStatus) {
									req.body.apiToken = token;
									next();
								} else {
									self.sendErrorResponse(req, res, "INVALID_TOKEN", 403);
								}
							}, function (error) {
								self.sendErrorResponse(req, res, "API_ERROR", error);
							});
						} else {
							self.sendErrorResponse(req, res, "No Authorized", error);
						}
					}
				} else {
					self.sendErrorResponse(req, res, "UnAuthorized", 404);
				}
			};

		} else if (req.path.indexOf('cron') != -1) {
			if ((!req.headers['x-cron-key'] || (req.headers['x-cron-key'] !== currentServerEnv.cronKey)) && (!req.query['x-cron-key'] || (req.query['x-cron-key'] !== currentServerEnv.cronKey))) {
				self.sendErrorResponse(req, res, "INVALID_Cron_KEY", 403);
			} else {
				next();
			};
		} else {
			next();
		}


	},

	verifyToken: function (token) {
		console.log("testtetste-testtetste-testtetste", token);
		return new promise(function (fulfill, reject) {
			if (!token) {
				fulfill(false);
			} else {
				jwt.verify(token, 'keyboard cat 4 ever', function (err, decoded) {
					if (err) {
						fulfill(false);
						console.log("token-error");
					} else {
						console.log("dsadasd");
						fulfill(true);

					}
				});
			}
		});
	},


	sendErrorResponse: function (reqInstance, resInstance, messageKey, resStatus) {
		self.consoleLog("Error: messageKey - " + messageKey + " resStatus - " + resStatus);
		var responseMessage = message[messageKey] ? message[messageKey] : messageKey;
		if (messageKey == "API_ERROR" && !utils.isInt(resStatus)) {
			responseMessage += " " + resStatus;
			resStatus = 500;
			self.consoleLog("Internal Sever Error in Test API :  - " + responseMessage, 'error');
		}

		var responseCode = codes[messageKey] ? codes[messageKey] : codes["CUSTOM_ERROR"];
		var errorJson = {
			status: "error",
			message: "" + responseMessage,
			code: responseCode
		};
		self.consoleLog("Error : errorJson - " + JSON.stringify(errorJson));

		try {
			var responseStatus = resStatus || 200;
			resInstance.statusCode = parseInt(responseStatus);
			resInstance.header("X-XSS-Protection", "1; mode=block");
			resInstance.header("X-Content-Type-Options", "nosniff");
			resInstance.header("x-frame-options", "DENY");
			resInstance.header("Access-Control-Allow-Origin", currentServerEnv.allowOrigin);
			resInstance.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key, x-api-token, x-admin-key, x-admin-token, X-Content-Type-Options, x-xss-protection, x-frame-options");
			if (currentServerEnv.writeLog) {
				var executionTime = (utils.getCurrentTS() - reqInstance.startTimeStamp);
				//Logs.update({ _id: reqInstance.logId }, { $set: { response: JSON.stringify(errorJson),  endTime : utils.getCurrentGMT(), executionTime : executionTime}}, function(err, log){
				resInstance.json(errorJson);
				//});
			} else {
				resInstance.json(errorJson);
			}

		} catch (ex) {
			var responseMessage = message["API_ERROR"] + " Error - " + ex;
			var errorJson = {
				status: "error",
				message: responseMessage,
				code: codes["API_ERROR"]
			};
			resInstance.statusCode = 500;
			resInstance.json(errorJson);
		}
	},



	sendSuccessResponse: function (reqInstance, resInstance, messageKey, resData) {
		self.consoleLog("Success: messageKey - " + messageKey + " resData - " + resData);
		var responseMessage = message[messageKey] ? message[messageKey] : messageKey;
		var responseCode = codes[messageKey] ? codes[messageKey] : codes["CUSTOM_SUCCESS"];
		resData = resData || [];
		var successJson = {
			status: "success",
			message: "" + responseMessage,
			code: 200,
			result: resData
		};
		self.consoleLog("Success : successJson - " + JSON.stringify(successJson));

		try {

			resInstance.statusCode = 200;
			resInstance.header("X-XSS-Protection", "1; mode=block");
			resInstance.header("X-Content-Type-Options", "nosniff");
			resInstance.header("x-frame-options", "DENY");
			resInstance.header("Access-Control-Allow-Origin", currentServerEnv.allowOrigin);
			resInstance.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
			resInstance.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key, x-api-token, x-admin-key, x-admin-token, X-Content-Type-Options, X-XSS-Protection, x-frame-options");

			if (currentServerEnv.writeLog) {
				var executionTime = (utils.getCurrentTS() - reqInstance.startTimeStamp);
				//Logs.update({ _id: reqInstance.logId }, { $set: { response: JSON.stringify(successJson),  endTime : utils.getCurrentGMT(), executionTime : executionTime}}, function(err, log){
				resInstance.json(successJson);
				//});
			} else {
				resInstance.json(successJson);
			}

		} catch (ex) {
			var responseMessage = message["API_ERROR"] + " Error - " + ex;
			var responseJson = {
				status: "error",
				message: responseMessage,
				code: codes["API_ERROR"]
			};
			resInstance.statusCode = 500;
			resInstance.json(responseJson);
		}

	},
	consoleLog: function (logData, type) {
		if (currentServerEnv.writeLog && logData) {
			if (utils.isArray(logData) || utils.isObject(logData)) {
				console.log(JSON.stringify(logData));
				var logInfo = util.format(utils.getCurrentGMT() + " : " + JSON.stringify(logData)) + '\n';
			} else {
				console.log(logData);
				var logInfo = util.format(utils.getCurrentGMT() + " : " + logData) + '\n';
			}
			if (type) {
				error_log_file.write(logInfo);
			} else {
				log_file.write(logInfo);
			}
		} else if (type) {
			if (utils.isArray(logData) || utils.isObject(logData)) {
				var logInfo = util.format(utils.getCurrentGMT() + " : " + JSON.stringify(logData)) + '\n';
			} else {
				var logInfo = util.format(utils.getCurrentGMT() + " : " + logData) + '\n';
			}
			error_log_file.write(logInfo);
		}
	}
};
module.exports = self;