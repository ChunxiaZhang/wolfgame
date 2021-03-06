var express = require('express');
var u = require("underscore");
var fs = require('fs');
var Avancement = require('../../models/avancement');
var constantes = require('../../lib/constantes.js');
var pagesJeu = require('../../lib/pagesJeu.js');
var d = require('../../lib/decision.js')
var da = require('../../lib/decisionsAleatoire.js');
var p = require('../../lib/perte.js');

var router = express.Router();

/**
 * Création d'une page de jeu.
 */
router.post('/', function(req, res) {
});

/**
 * Service Web qui retourne l'information d'une page qui contient un choix
 * aléatoire.
 *
 * @param pageId ID de la page de l'histoire
 *
 * @return La représentation du choix aléatoire de la page
 */
router.get('/choixAleatoire/:pageId', function(req, res) {
    var id = req.params.pageId;

    var choix = u.find(da.decisionsAleatoire, function(page) {
        return page.id == id;
    });

    // Si la page n'a pas de décision aléatoire, on retourne un JSON vide.
    if (choix == undefined) {
        res.json({message: "Cette page n'a pas de choix aléatoires possibles."});
    } else {
        var joueur = req.session.joueur;
        if (joueur == undefined) {
            res.json({message: "Le joueur n'existe pas dans la session."});
        } else {

            Avancement.findOne({joueurId: joueur._id}, function(err, avancement) {
                if (err) {
                    res.send(err);
                } else {
                    // for page 134, 167, check if there is record for this page decisions in DB to continue the game
                    if (avancement.decisionPossible && avancement.decisionPossible.length > 0) {
                        console.log("avancement.decisionPossible: " + avancement.decisionPossible);
                        res.json(avancement.decisionPossible);
                    } else {
                        // if not find decisions in DB, then calculate the possible dicisions
                        var valeurAleatoire = choix.f(joueur);
                        var decisions = u.map(choix.decision, function(decision) {
                            decision.valeurAleatoire = valeurAleatoire;
                            if (decision.min <= valeurAleatoire && decision.max >= valeurAleatoire) {
                                decision.isValid = true;
                                return decision;
                            } else {
                                decision.isValid = false;
                                return decision;
                            }
                        });

                        // Save result to avancement DB used to continue game next time
                        Avancement.findOne({joueurId: joueur._id}, function(err, avancement) {
                            if (err) {
                                res.send(err);
                            } else {
                                avancement.decisionPossible = decisions;
                                avancement.save(function(err) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        console.log("save avancement to DB");
                                    }
                                });
                            }
                        });

                        res.json(decisions);
                    }

                }
            });

        }
    }
});

/**
 * For page 331, 129, 209, 155, 12
 * Service Web qui retourne l'information d'une page qui contient une perte
 *
 * @param pageId ID de la page de l'histoire
 *
 * @return La perte de la page
 */
router.get('/confirmation/:pageId', function(req, res) {
    var id = req.params.pageId;
    var choix = u.find(p.perte, function(page) {
        return page.id == id;
    });

    // Si la page n'a pas de décision aléatoire, on retourne un JSON vide.
    if (choix == undefined) {
        res.json({message: "Cette page n'a pas de perte."});
    } else {
        var joueur = req.session.joueur;
        if (joueur == undefined) {
            res.json({message: "Le joueur n'existe pas dans la session."});
        } else {
            var result = choix.f(joueur);
            console.log("result objets: " + result.joueur.objets);
            res.json(result);
        }
    }
});


router.get('/decision/:pageId', function(req, res) {
    var id = req.params.pageId;
    var choix = u.find(d.decisions, function(page) {
        return page.id == id;
    });

    if (choix == undefined) {
        res.json({message: "Cette page n'a pas de choix possibles."});
    } else {
        var joueur = req.session.joueur;
        console.log("joueur: " + joueur);

        if (joueur == undefined) {
            res.json({message: "Le joueur n'existe pas dans la session."});
        } else {
            var decisions = u.map(choix.decision, function(decision) {
                decision.isValid = decision.valid(joueur); // if the player can go this page (for page 91)
                return decision;
            });
            res.json(decisions);
        }
    }
});

/**
 * Ce service web envoie la représentation d'une sous-section d'une page
 * de jeu.
 *
 * @param pageId ID de la page de l'histoire
 * @param sectionID Numéro de section de la page avec id = pageId
 *
 * @return La représentation de la section d'une page de l'histoire
 */
router.get('/:pageId/:sectionId', function(req, res) {
    var id = req.params.pageId;
    var section = req.params.sectionId;
    var page = u.find(pagesJeu.pages, function(page) {
        return page.id == id && page.section == section;
    });
    res.json(page);
});

module.exports = router;
