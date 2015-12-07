/**
 * This directive is used to extend the combat part in game play page
 *
 * */
gameApp.directive('combatPart', function(){
    return {
        restrict: 'A',
        scope: {
            combat: '=',
            player: '=',
            identify: '=',
            isPlayerWin: '=',
            isFuir: '=',
            combatFinish: '='
        },
        templateUrl: "/templates/combat.html",
        controller: 'CombatController'
    }
});

/**
 * This directive is used to extend the stats part in game play page
 *
 * */
gameApp.directive('statsPart', function(){
    return {
        restrict: 'A',
        scope: {
            player: '='
        },
        templateUrl: "/templates/stats.html"
    }
});

/**
 * This controller is used to trait combat logic,
 * click combat button, get the combat result from server api,
 * when combat finish, confirm if player win, if win give him message and load next section,
 * if player lost the game, then give message and delete this player from DB
 * click fuir button, quit the combat and update player data
 * */
gameApp.controller('CombatController', ['$scope', '$http', 'factoryProperties', function($scope, $http, factoryProperties){
    $scope.rondes = [];
    $scope.isFuir = false;
    $scope.combatFinish = false;
    factoryProperties.constantes(function(constantes){
        $scope.constantes = constantes;
        if($scope.player.disciplines.indexOf($scope.constantes.discipline.PUISSANCE_PSYCHIQUE) < 0) {
            $scope.havePuissancePsychique = false;
        } else {
            $scope.havePuissancePsychique = true;
        }
    });

    // Click combattre button start a ronde
    $scope.combattre = function(withPuissance){
        $http.get('/api/combat/' + $scope.identify.pageId + '/' + ($scope.player.endurancePlus - $scope.getPlayerPert()) + '/'
                + $scope.player.habiletePlus + '/' + ($scope.combat.endurance - $scope.getEnnemPert()) + '/' + $scope.combat.habilete)
            .success(function(data){
                $scope.rondes.push(data);
                var bonnus = 0;
                if($scope.havePuissancePsychique) {
                    bonnus = 2;
                }
                var endurancePossible = $scope.player.endurancePlus - $scope.getPlayerPert() + bonnus;
                $scope.rondes[$scope.rondes.length-1].currentEndurancePlayer = endurancePossible > $scope.player.enduranceBase ? $scope.player.endurance: endurancePossible;
                $scope.rondes[$scope.rondes.length-1].currentEnduranceEnnemi = $scope.combat.endurance - $scope.getEnnemPert();
                $scope.gameStatus();
            });

    };

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

    /**
     * To confirm game status, if player win or not,
     * if player lost, delete this player data in DB,
     * if player win, update player data, and load next section
     * */
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
                var combats = [];
                for (var i = 0; i < $scope.rondes.length; i++) {
                    var combat = {chiffreAleatoire: $scope.rondes[i].chiffreAleatoire, enduranceMonstre: $scope.rondes[i].currentEnduranceEnnemi}
                    combats.push(combat);
                }
                $http.put('/api/joueurs/avancement/' + $scope.player._id, {combats: combats})
                    .success(function(){
                        console.log("update combats ");
                    });
                $scope.player.endurancePlus -= $scope.getPlayerPert();
                $http.put('/api/joueurs/' + $scope.player._id, $scope.player)
                    .success(function(){
                        console.log("update player");
                    });
                $scope.isPlayerWin = true;
            }
            if (endurancePlayer <= 0) {
                $scope.isPlayerWin = false;
                $http.delete("/api/joueurs/" + $scope.player._id).success(function(){
                    console.log("delete player");
                });
            }

            if($scope.isPlayerWin && $scope.combatFinish) {
                $scope.identify.sectionId += 1;
                $scope.$parent.loadSection($scope.identify.pageId, $scope.identify.sectionId);
            }
        }
    };

    /**
     * If player click fuir button, then reduce the endurance of this player,
     * update player data in DB,
     * load next section of this page
     * */
    $scope.fuir = function(){
        $scope.identify.sectionId += 1;
        $scope.$parent.loadSection($scope.identify.pageId, $scope.identify.sectionId);
        $scope.isFuir = true;
        $scope.combatFinish = true;
        $scope.player.endurancePlus -= $scope.getPlayerPert();
        $http.put('/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
            console.log("update player data");
        });
    }

}]);



