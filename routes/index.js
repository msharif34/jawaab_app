var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var db = require('../models');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index')

});

router.get('/translation', function(req, res, next) {
	db.fatwa.find({where: {questionSomali: null, answerSomali:null}}).then(function(data){
		// res.send(data)
	  db.category.find({where: {id: data.categoryId}}).then(function(category){
	  res.render('translation',{
	  	  data: data,
	  	  category: category});
	  });
	})
});

router.post('/', function(req, res, next) {
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
				});
			});
		});
	});
});

router.get('/categories', function(req, res, next) {
	db.fatwa.findAll().then(function(fatwa){
		db.category.findAll({where: {nameSomali: null}}).then(function(data){
		// res.send(fatwa[0].question)
		res.render('categories', { data: data,
								  fatwa: fatwa})
	})
	})
});

router.get('/category/:name/:id', function(req, res, next) {
	var id = req.params.id
	db.fatwa.findAll({where: {categoryId: id,questionSomali: null, answerSomali:null}}).then(function(data){
		// res.send(data)
	  db.category.find({where: {id: id}}).then(function(category){
	  res.render('showQuestions',{
	  	  data: data,
	  	  category: category});
	  });
	})
});

router.get('/question/:name/:id', function(req, res, next) {
	var id = req.params.id
	db.fatwa.find({where: {id: id}}).then(function(data){
		// res.send(data.question)
	  db.category.find({where: {id: id}}).then(function(category){
	  res.render('answer',{
	  	  data: data,
	  	  category: category});
	  });
	})
});


module.exports = router;
