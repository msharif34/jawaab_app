var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var db = require('./models');
var async = require('async');

request('http://horseedmedia.net/', function(error, response, data){
			// console.log(data);
      var count = 0;
			var $ = cheerio.load(data);
			// 1st para in async.each() is the array of items
			async.eachSeries($('.post'),
			  // 2nd param is the function that each item is passed to
			  function(item, callback){
          var newsArray = [];
          var article = {};
          if(item.children[2]){
            count+=1;
            article[count] = {
              "title": item.children[1].children[0].children[0].children[0].data,
              "image": item.children[0].children[0].attribs.src,
              "content_preview": item.children[2].children[0].children[0].data,
              "link": item.children[0].attribs.href
            };
            newsArray.push(article);
            console.log(newsArray)
          }

			    // Call an asynchronous function, often a save() to DB
            callback()
			  	},
			  function(err){
			 // All tasks are done now
			console.log(err);
		 }
	);
});
