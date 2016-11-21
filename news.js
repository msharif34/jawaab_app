var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var db = require('./models');
var async = require('async');

function dataConstructor(item, count) {
  var time, meta, link, content_preview, title, image;
  var newsArray = [];
  var article = {};
  this.printData = function (count) {
      link = item.children[0].attribs.href;
      meta = item.children[1].children[1].children;
      content_preview = item.children[2].children[0].children[0].data;
      title = item.children[1].children[0].children[0].children[0].data;
      image = item.children[0].children[0].attribs.src;
      count+=1;

      for(var i in meta){
        if(meta[i].name === 'time') {
          time = meta[i].children[0].data
        };
      };

      article[count] = {
        "title": title,
        "time": time,
        "image": image,
        "content_preview": content_preview,
        "link": link
      };
        newsArray.push(article);
    return newsArray;
  }
}

request('http://horseedmedia.net/', function(error, response, data){
      var $ = cheerio.load(data);
      var count = -1;
      // 1st para in async.each() is the array of items
      async.eachSeries($('.post'),
        // 2nd param is the function that each item is passed to
        function(item, callback){
          count += 1;
          if(item.children[2] !== undefined || null){
            var test = new dataConstructor(item);
            var printedData = test.printData(count)

            callback();
            console.log(printedData);
          };
          // Call an asynchronous function, often a save() to DB
        },
        function(err){
       // All tasks are done now
  			if(err){
          console.log('there has been an error: ' + err)
        };
		 }
	);
});
