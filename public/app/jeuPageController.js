/**
 * Created by Zoe on 2015-11-16.
 */
gameApp.controller('jeuPageController', function($scope, $routeParams, $http, $window,
                                                 factoryPlayers, factoryCombatResult, factoryPages, factoryPageIdentify){

    $scope.haveCombat = false;
    $scope.haveImg = false;
    $scope.haveRonde = false;
    $scope.haveDecision = false;
    $scope.shouldShowDecision = true;
    $scope.haveAjouterObjets = false;
    factoryPlayers.currentPlayer(function(data){
        $scope.player = data;
        console.log("current playerId: " + $scope.player._id);
        factoryPageIdentify.identify($scope.player._id, function(data){
            $scope.identify = data;
            $scope.numeroPage = $scope.identify.pageId;

            if($scope.identify.combats && $scope.identify.combats.length > 0) {
                $scope.haveRondeCombat = true;
            }
            $scope.loadPage($scope.identify.pageId, $scope.identify.sectionId);
        });
    });
    $scope.clickPageLink = function(pageId, sectionId, $index) {
        if($scope.decision[$index].isValid){
            $scope.loadPage(pageId, sectionId);
        }
    }
    $scope.loadPage = function(pageId, sectionId) {
        console.log("load page: pageId:" + pageId + " sectionId: " + sectionId);
        $scope.numeroPage = pageId;
        factoryPages.page(pageId, sectionId, function(data){
            if(data.contenu) {
                $scope.contenu = data.contenu;
                if($scope.contenu.img) {
                    $scope.haveImg = true;
                }
            }
            //page 78, 180
            if(data.combat) {
                $scope.haveCombat = true;
                $scope.shouldShowDecision = false;
                $scope.combat = data.combat;
            }
            // page 12
            if(data.ajouterObjets) {
                $scope.haveAjouterObjets = true;
                $scope.ajouterObjets = data.ajouterObjets;
            }
        });

        factoryPages.decision(pageId, function(data){
            if (data) {
                $scope.haveDecision = true;
                $scope.decision = data;

                if(pageId == 160) {

                }
            }

        });

        //update acancement
        $scope.avancer(pageId, sectionId);
    }


    $scope.avancer = function(pageId, sectionId) {
        $http.put('http://localhost:3000/api/joueurs/avancement/' + $scope.player._id, {pageId: pageId, sectionId: sectionId})
            .success(function(){
                console.log("update avancement to " + pageId);
            });
    }
    $scope.rondes = [];
    $scope.getPlayerPert = function(){
        if($scope.rondes && $scope.rondes.length > 0) {
            var i = 0;
            var length = $scope.rondes.length;
            var result = 0;
            for(i; i < length; i++) {
                result += $scope.rondes[i].degatJoueur;
            }
            return result;
        } else {
            return 0;
        }
    }
    $scope.getEnnemPert = function(){
        if($scope.rondes && $scope.rondes.length > 0) {
            var i = 0;
            var length = $scope.rondes.length;
            var result = 0;
            for(i; i < length; i++) {
                result += $scope.rondes[i].degatEnnemi;
            }

            return result;
        } else {
            return 0;
        }
    }

    // What is the other button
    $scope.combattre = function(){
        $scope.haveRonde = true;
        $scope.shouldShowDecision = false;
        factoryCombatResult.result($scope.player.endurancePlus - $scope.getPlayerPert(), $scope.player.habiletePlus,
            $scope.combat.endurance - $scope.getEnnemPert(), $scope.combat.habilete,function(data){
                $scope.rondes.push(data);
                $scope.rondes[$scope.rondes.length-1].currentEndurancePlayer = $scope.player.endurancePlus - $scope.getPlayerPert();
                $scope.rondes[$scope.rondes.length-1].currentEnduranceEnnemi = $scope.combat.endurance - $scope.getEnnemPert();
                $scope.gameStatus();

            });

    };

    $scope.gameStatus = function(){
        if ($scope.rondes && $scope.rondes.length > 0) {
            var endurancePlayer = $scope.rondes[$scope.rondes.length - 1].currentEndurancePlayer;
            var enduranceEnnmie = $scope.rondes[$scope.rondes.length - 1].currentEnduranceEnnemi;
            if(enduranceEnnmie <=0 || endurancePlayer <= 0) {
                $scope.combatFinish = true;
            } else {
                $scope.combatFinish = false;
            }
            if (enduranceEnnmie <= 0 && endurancePlayer > 0) {
                console.log("player win!");
                var combats = [];
                for (var i = 0; i < $scope.rondes.length; i++) {
                    var combat = {chiffreAleatoire: $scope.rondes[i].chiffreAleatoire, enduranceMonstre: $scope.rondes[i].currentEnduranceEnnemi}
                    combats.push(combat);
                }
                $http.put('http://localhost:3000/api/joueurs/avancement/' + $scope.player._id, {combats: combats})
                    .success(function(){
                        console.log("update combats ");
                    });
                $scope.player.endurancePlus -= $scope.getPlayerPert();
                $http.put('http://localhost:3000/api/joueurs/' + $scope.player._id, $scope.player)
                    .success(function(){
                        console.log("update player");
                    });
                $scope.shouldShowDecision = true;
                $scope.isPlayerWin = true;
            }
            if (endurancePlayer <= 0) {
                $scope.shouldShowDecision = false;
                $scope.isPlayerWin = false;
            }
        }
    };

    $scope.quitGame = function(){
        factoryPlayers.deletePlayer($scope.player._id, function(){
            console.log("delete player:" + $scope.player._id);
        });
        $window.location.href = "/";
    }

    $scope.isFuir = false;
    $scope.fuir = function(){
        //TODO after fuir ?
        $scope.shouldShowDecision = true;
        $scope.isFuir = true;
        $scope.combatFinish = true;
        $scope.player.endurancePlus -= $scope.getPlayerPert();
        $http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
            console.log("update player data");
        });
    }

});