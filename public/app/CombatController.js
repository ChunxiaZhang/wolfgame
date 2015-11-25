gameApp.controller('CombatController', ['$scope', '$http', 'factoryPlayers', function($scope, $http, factoryPlayers){
    $scope.rondes = [];
    $scope.isFuir = false;
    $scope.combatFinish = false;
    // Click combattre button start a ronde
    $scope.combattre = function(){
        factoryCombatResult.result($scope.player.endurancePlus - $scope.getPlayerPert(), $scope.player.habiletePlus,
            $scope.combat.endurance - $scope.getEnnemPert(), $scope.combat.habilete,function(data){
                $scope.rondes.push(data);
                $scope.rondes[$scope.rondes.length-1].currentEndurancePlayer = $scope.player.endurancePlus - $scope.getPlayerPert();
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
                factoryPlayers.deletePlayer($scope.player._id, function(){
                    console.log("delete player:" + $scope.player._id);
                });
            }
        }
    };

    $scope.fuir = function(){
        $scope.shouldShowDecision = true;
        $scope.isFuir = true;
        $scope.combatFinish = true;
        $scope.player.endurancePlus -= $scope.getPlayerPert();
        $http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
            console.log("update player data");
        });
    }
}]);
