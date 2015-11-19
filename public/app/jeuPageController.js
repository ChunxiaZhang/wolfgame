/**
 * Created by Zoe on 2015-11-16.
 */
gameApp.controller('jeuPageController', function($scope, $routeParams, $http,
                                                 factoryPlayers, factoryCombatResult, factoryPages, factoryPageIdentify){

    $scope.haveCombat = false;
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

            $scope.loadPage($scope.identify.pageId, $scope.identify.sectionId);
        });
    });
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

    $scope.combattre = function(){
        //TODO when click "combattre"
        factoryCombatResult.result($scope.player.endurance, $scope.player.habilete,
            $scope.combat.endurance,$scope.combat.habilete,function(data){
                $scope.result = data;
            });
    };

});