var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var db = require('../models');



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


















module.exports = router;
