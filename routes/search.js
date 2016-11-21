var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');



router.get('/results', function(req, res){
	var search = req.query.q;
	var term = search.split(' ');
	var searchQuery = term.map(function(item){
		  return {$ilike:'%'+item+'%'};
		});
	db.fatwa.findAll({
					  where:{
					    question:{
					      $and:searchQuery
					    }
					  }
					}).then(function(data){
			// res.send(data)
	res.render('results', {data: data,
							term: term })
	})
})



router.get('/news', function(req, res){
          request('http://horseedmedia.net/', function(error, response, data){
			// console.log(data);
      var count = 0;
      var newsArray = [];
      var article = {};
      var time;
      var meta;
      var link;
      var content_preview;
      var title;
      var image;
      var $ = cheerio.load(data);
      // 1st para in async.each() is the array of items
      async.eachSeries($('.post'),
        // 2nd param is the function that each item is passed to
        function(item, callback){

          if(item.children[2] !== undefined || null){
            link = item.children[0].attribs.href;
            meta = item.children[1].children[1].children;
            content_preview = item.children[2].children[0].children[0].data;
            title = item.children[1].children[0].children[0].children[0].data;
            image = item.children[0].children[0].attribs.src;
            count+=1;

              for(var i in meta){
                if(meta[i].name === 'time'){  
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
            console.log(newsArray)
          };
            newsArray.push(article);
      

            callback()
          // Call an asynchronous function, often a save() to DB
          },
        function(err){
       // All tasks are done now
       res.send(newsArray)
  			if(err){
          console.log('there has been an error: ' + err)
        };
		 }
	);
});
})














module.exports = router;
