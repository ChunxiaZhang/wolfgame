/**
 * Created by Zoe on 2015-11-16.
 */
gameApp.controller("playersListCtrl", function($scope, $http, $window, factoryPlayers){
    factoryPlayers.list(function(dbPlayers){
        $scope.dbPlayers = dbPlayers;

    });

    $scope.deletePlayer = function(playerId) {
        factoryPlayers.deletePlayer(playerId, function () {
            var i = 0;
            var length = $scope.dbPlayers.length;
            var index;
            console.log(typeof playerId);
            console.log(typeof $scope.dbPlayers[i]._id);
            for (i; i < length; i++) {
                if (playerId == $scope.dbPlayers[i]._id) {
                    index = i;
                }
            }
            console.log(index);
            $scope.dbPlayers.splice(index, 1);
        });
    }

    $scope.restart = function(playerId) {
        $http({
            method: 'GET',
            url:'http://localhost:3000/api/joueurs/avancement/' + playerId,
            cash: true
        }).success(function(data){
            $window.location.href = "/jeu/" + data.pageId + "/" ;
            //jeuPageController.loadPage(data.pageId, data.sectionId);
        });
    }
});