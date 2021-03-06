var express = require('express');
var constantes = require('../lib/constantes.js')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('accueil');
});

router.get('/aide', function(req, res, next) {
    res.render('aide');
});

// GET game play page
router.get('/page', function(req, res) {
    res.render('pageJeu');
});

module.exports = router;

