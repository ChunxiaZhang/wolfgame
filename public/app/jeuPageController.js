/**
 * Created by Zoe on 2015-11-16.
 */
gameApp.controller('jeuPageController', function($scope, $routeParams, $http,
                                                 factoryPlayers, factoryCombatResult, factoryPages, factoryPageIdentify){

    $scope.haveCombat = false;
    $scope.haveRonde = false;
    $scope.haveDecision = false;
    $scope.haveAjouterObjets = false;
    factoryPlayers.currentPlayer(function(data){
        $scope.player = data;
        for(var i in $scope.player) {
            console.log("player: " + i);
        }

        console.log("$scope.player: "+$scope.player);
        factoryPageIdentify.identify($scope.player._id, function(data){
            $scope.identify = data;
            for(var i in data) {
                console.log("identify:" + i);
            }
            console.log("$scope.identify: "+$scope.identify);
            $scope.numeroPage = $scope.identify.pageId;

            if($scope.identify.combats || $scope.identify.combats.length > 0) {
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
        console.log("pageId:" + pageId + " sectionId: " + sectionId);
        $scope.numeroPage = pageId;
        factoryPages.page(pageId, sectionId, function(data){
            if(data.contenu) {
                $scope.contenu = data.contenu;
            }
            //page 78, 180
            if(data.combat) {
                $scope.haveCombat = true;
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
            return $scope.rondes.reduce(function (a, b) {
                return a.degatJoueur + b.degatJoueur;
            });
        } else {
            return 0;
        }
    }
    $scope.getEnnemPert = function(){
        if($scope.rondes && $scope.rondes.length > 0) {
            return $scope.rondes.reduce(function (a, b) {
                return a.degatEnnemi + b.degatEnnemi;
            });
        } else {
            return 0;
        }
    }
    $scope.combattre = function(){
        $scope.haveRonde = true;
        factoryCombatResult.result($scope.player.endurancePlus - $scope.getPlayerPert(), $scope.player.habiletePlus,
            $scope.combat.endurance - $scope.getEnnemPert(), $scope.combat.habilete,function(data){
                $scope.rondes.push(data);
            });

    };

    $scope.fuir = function(){
        $scope.player.endurancePlus -= $scope.getPlayerPert();
        $scope.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
            console.log("update player data");
        });
    }

});