var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var db = require('./models');
var async = require('async');

request('http://islamqa.info/en/cat/220?page=2', function(error, response, data){
			// console.log(data);
			var $ = cheerio.load(data);
			// 1st para in async.each() is the array of items
			async.eachSeries($('.list-group-item'),
			  // 2nd param is the function that each item is passed to
			  function(item, callback){
			  	// console.log(item)
			    // Call an asynchronous function, often a save() to DB
			    // if (index < 2){
					var category = $('.panel-title').text();
					// console.log('Category is: ' + category)
					var question = $(item).text().replace(/\-/g, ' ').replace(/[0-9]/g, '')
					// console.log('Question: ', $(item).text());
					console.log('---------');
					var url = "http://islamqa.info/" + ($(item).attr('href'));
					//request
				 request(url, function(error, response, data){
						var fatwa = cheerio.load(data)
						console.log('-------')
						var answer = fatwa('p').text();
						// console.log('Answer: ', fatwa('p').text());
						//create category
							db.category.findOrCreate({where: {name:category}})
							.spread(function(category,created){
							//create fatwa
							  db.fatwa.create({
							    categoryId:category.id,
							    question: question,
							    answer: answer
							  }).then(function(fatwa){
							    //do something here
							    console.log(fatwa.get())
								//callback()
				  				callback()
							  });
							});
					});
			  	},
			  // 3rd param is the function to call when everything's done
			  function(err){
			 // All tasks are done now
			console.log(err);
		 }
	);
});

