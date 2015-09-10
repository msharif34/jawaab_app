var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var db = require('../models');


/* GET home page. */
router.get('/', function(req, res, next) {
	db.fatwa.find({where: {questionSomali: null, answerSomali:null}}).then(function(data){
	  db.category.find({where: {id: data.categoryId}}).then(function(category){
	  res.render('index', { data: data,
	  						category: category});
	  })
	})
});

router.post('/', function(req, res, next) {
	console.log(req.body)
	db.category.find({where: {id:req.body.categoryID}})
		.then(function(category){
			console.log(category)
			category.nameSomali = req.body.category;
			category.save().then(function(){
				//create fatwa
				db.fatwa.findById(req.body.fatwaID).then(function(fatwa){
					fatwa.questionSomali = req.body.question;
					fatwa.answerSomali = req.body.answer;
					fatwa.save().then(function(){
						res.redirect('/');
					})
				})
			})
		});
});

module.exports = router;
