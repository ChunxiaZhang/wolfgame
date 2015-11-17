var express = require('express');
var rest = require('restler');
var u = require("underscore");
var constantes = require('../lib/constantes.js')
var router = express.Router();

var Joueur = require('../models/joueur');
var Avancement = require('../models/avancement');

// GET page de création du joueur.
router.get('/creationJoueur', function(req, res, next) {
    res.render('creationJoueur', {
        c: constantes,
        erreursMsg: []
    });
});

// POST page de création du joueur
router.post('/jeu/1', function(req, res) {
    console.log("1 post player");
    var erreursMsg = [];

    // Récupération des données du formulaire
    console.log("disciplines:" + req.body.disciplines);
    console.log("armes:" + req.body.armes);
    console.log("objets:" + req.body.objets);
    console.log("objetsSpeciaux:" + req.body.objetsSpeciaux);
    var disciplines = (req.body.disciplines) ? [].concat(req.body.disciplines) : [];
    var armes = (req.body.armes) ? [].concat(req.body.armes) : [];
    var objets = (req.body.objets) ? [].concat(req.body.objets) : [];
    var objetsSpeciaux = (req.body.objectsSpeciaux) ? [].concat(req.body.objectsSpeciaux) : [];

    // Traitement des disciplines choisies
    var NB_DISCIPLINE = 5;
    if (disciplines.length < NB_DISCIPLINE || disciplines.length > NB_DISCIPLINE) {
        erreursMsg.push("Vous devez choisir EXACTEMENT " + NB_DISCIPLINE + " disciplines Kai.");
        console.log("2 post player");
    }

    // Traitement des armes choisies
    console.log(disciplines);
    if (!u.contains(disciplines, constantes.discipline.MAITRISE_ARMES) && armes.length > 1) {
        erreursMsg.push("Vous ne pouvez pas choisir une arme si vous ne maîtriser pas la discipline de Maîtrise des Armes.");
        console.log("3 post player");
    }

    // Traitement des objets choisis
    var NB_OBJET = 2;
    console.log(armes.length + "  " + objets.length + "  " + objetsSpeciaux.length);
    var nbObjetsChoisis = armes.length + objets.length + objetsSpeciaux.length;
    if (nbObjetsChoisis < 2 || nbObjetsChoisis > 2) {
        erreursMsg.push("Vous devez choisir EXACTEMENT " + NB_OBJET + " objets.");
        console.log("4 post player");
    }
    console.log("5 post player");
    // S'il y au moins une erreur, on revient à la page de création avec la
    // liste d'erreurs. Sinon, on se dirige vers la 1ere page de l'histoire.
    if (u.isEmpty(erreursMsg)) {
        console.log("6 post player");
        var joueur = new Joueur;
        joueur.joueurNom = req.body.playerName;
        joueur.habileteBase = u.random(10, 19);
        joueur.enduranceBase = u.random(20, 29);
        joueur.pieceOr = u.random(10, 19);
        joueur.disciplines = disciplines;
        joueur.armes = armes;
        joueur.objets = objets;
        joueur.objetsSpeciaux = objetsSpeciaux;
        joueur.habiletePlus = habiletePlus(joueur);
        joueur.endurancePlus = endurancePlus(joueur);

        // On ajoute le joueur dans la session
        joueur.save(function(err, joueur) {
            console.log("7 post player");
            if (err) {
                console.log("save player fail");
                res.send(err);
            } else {
                console.log("save player");
                rest.post('http://localhost:3000/api/joueurs/avancement/' + joueur.id)
                .on('complete', function(data, response) {
                    console.log(response);
                });
                req.session.joueur = joueur;
                res.redirect('/jeu/1');
            }
        });
    } else {
        console.log("8 post player");
        console.log(erreursMsg);
        res.render('creationJoueur', {
            c: constantes,
            erreursMsg: erreursMsg
        });
    }
});

// GET constantes.
router.get('/constantes', function(req, res, next) {
    res.json(constantes);
});

/**
 * On calcul les points d'habiletes du joueur en fonction de ses disciplines
 * et de ses objets.
 *
 * @param joueur Joueur du jeu
 * @return Habilete calculer en fonction du joueur
 */
function habiletePlus(joueur) {
    var habilete = joueur.habileteBase;
    if (u.contains(joueur.disciplines, constantes.discipline.MAITRISE_ARMES) && !u.isEmpty(joueur.armes)) {
        habilete = joueur.habileteBase + 2;
    } else {
        habilete = joueur.habileteBase - 4;
    }
    return habilete;
}

/**
 * On calcul les points d'endurance du joueur en fonction de ses disciplines
 * et de ses objets.
 *
 * @param joueur Joueur du jeu
 * @return Endurance calculée en fonction du joueur
 */
function endurancePlus(joueur) {
    var endurance = joueur.enduranceBase;
    if (u.contains(joueur.objetsSpeciaux, constantes.objetSpecial.GILET_CUIR_MARTELE)) {
        endurance = joueur.enduranceBase + 2;
    }
    return endurance;
}


module.exports = router;

