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

gameApp.directive('statsPart', function(){
    return {
        restrict: 'A',
        scope: {
            player: '='
        },
        templateUrl: "/templates/stats.html",
        controller: function($scope, $interval) {
            /*$interval(function(){
             console.log("Hi, after 2 seconds");
             }, 2000);*/
        }
    }
});

gameApp.controller('CombatController', function($scope, $http){
    $scope.rondes = [];
    $scope.isFuir = false;
    $scope.combatFinish = false;


    if($scope.player.disciplines.indexOf("puissancePsychique") < 0) {
        $scope.havePuissancePsychique = false;
    } else {
        $scope.havePuissancePsychique = true;
    }
    // Click combattre button start a ronde
    $scope.combattre = function(withPuissance){
        $http.get('http://localhost:3000/api/combat/' + ($scope.player.endurancePlus - $scope.getPlayerPert()) + '/'
                + $scope.player.habiletePlus + '/' + ($scope.combat.endurance - $scope.getEnnemPert()) + '/' + $scope.combat.habilete)
            .success(function(data){
                $scope.rondes.push(data);
                var bonnus = 0;
                if($scope.havePuissancePsychique) {
                    bonnus = 2;
                }
                $scope.rondes[$scope.rondes.length-1].currentEndurancePlayer = $scope.player.endurancePlus - $scope.getPlayerPert() + bonnus;
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
                $scope.isPlayerWin = true;
            }
            if (endurancePlayer <= 0) {
                $scope.isPlayerWin = false;
            }

            if($scope.isPlayerWin && $scope.combatFinish) {
                console.log("load section from directive");
                console.log("sectionId: " + ($scope.identify.sectionId + 1));
                $scope.identify.sectionId += 1;
                $scope.$parent.loadSection($scope.identify.pageId, $scope.identify.sectionId);
            }
        }
    };

    $scope.fuir = function(){
        $scope.identify.sectionId += 1;
        $scope.loadSection($scope.identify.pageId, $scope.identify);
        $scope.isFuir = true;
        $scope.combatFinish = true;
        $scope.player.endurancePlus -= $scope.getPlayerPert();
        $http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
            console.log("update player data");
        });
    }

})



