"use strict";
/**
 * @doc JiraRecurringTask
 * @name JiraRecurringTask.helper:utils
 * @description To provide all basic function & independent functions.
 *
*/

var moment	 = require('moment');
var self = {
  //Method to check array value
  isArray : function(ar){
	return (!!ar) && (ar.constructor === Array);
  },

  //Method to check Integer value
  isInt : function (value) {
	return !isNaN(value) &&
		   parseInt(Number(value)) == value &&
		   !isNaN(parseInt(value, 10));
  },

  //Method to check Object
  isObject : function(obj){
	return (!!obj) && (obj.constructor === Object);
  },

  //Method to check String
  isString : function(str){
	return (!!str) && (str.constructor === String)
  },

  //Method to check value in array
  inArray : function(arr, val){
	if (arr.indexOf(val) == -1) {
	  return false;
	}else{
	  return true;
	}
  },

  //Method to get current timestamp in GMT
  getCurrentTS : function(date){
	var requestedDate = date || new Date();
	return moment.utc(requestedDate).valueOf();
  },

  //Method to get current date time in GMT
  getCurrentGMT : function(date){
	var requestedDate = date || new Date();
	return moment(requestedDate).format();
  },

  //Method to generate random number of any length
  ran_no : function ( min, max ){
    return Math.floor( Math.random() * ( max - min + 1 )) + min;
  },

  //Method to generate random ID of any length
  uid : function ( len ){
    var str     = '';
    var src     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var src_len = src.length;
    var i       = len;

    for( ; i-- ; ){
      str += src.charAt( this.ran_no( 0, src_len - 1 ));
    }

    return str;
  },

};

module.exports = self;
