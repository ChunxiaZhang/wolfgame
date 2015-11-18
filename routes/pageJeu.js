var express = require('express');
var jade = require('jade');
var fs = require('fs')
var path = require('path');
var u = require('underscore');
var pagesJeu = require('../lib/pagesJeu.js')
var router = express.Router();

router.get('/jeu/', function(req, res) {
    //var joueur = req.session.joueur;
     res.render('pageJeu');
});



/**
 * On envoie le HTML de la page complète désirée au client.
 * Le HTML des sous-sections de la page demandée sont combinées.
 *
 */
router.get('/jeu/:pageId', function(req, res, next) {
    console.log('/jeu/:pageId');
    var id = req.params.pageId;
    var htmlPage = u.chain(fs.readdirSync('views/page'))
        // On récupère les sous-sections de la page
        .filter(function(file) {
            return file.indexOf(id + '_') == 0;
        })
        // Pour chaque sous-section, on compile son Jade pour obtenir du HTML.
        .map(function(file) {
            console.log("file: " + file);
            console.log("path:" + 'views/page/' + file);
            var fn = jade.compile(fs.readFileSync('views/page/' + file, 'utf8'), {
                filename: path.join('views/page/', file)
            });
            console.log("filename: " + filename);
            return fn({name:'Oleg'}).trim();
        })
        // On combine chaque HTML obtenu un à la suite de l'autre.
        .join("");

    console.log("htmlPage" + htmlPage);
    res.render('page/pageJeu', {
        numeroPage: req.params.pageId,
        htmlPage: htmlPage
    });
});

router.get('/compile/creation', function(req, res){
    var fn = jade.compile(fs.readFileSync('views/page/12_1.jade', 'utf8'), {
        filename: path.join('views/page/', file)
    });
    console.log(fn({name:'Oleg'}).trim());
/*})
    fs.readFile('views/page/1_1.jade', 'utf8', function (err, data) {
        if (err) throw err;
        console.log(data);
        var fn = jade.compile(data);
        var html = fn({name:'Oleg'});
        console.log(html);
    });*/
});

module.exports = router;

