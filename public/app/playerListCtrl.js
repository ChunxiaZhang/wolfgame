/**
 * Created by Zoe on 2015-11-16.
 */
gameApp.controller("playersListCtrl", function($scope, $http, $window, factoryPlayers, factoryPageIdentify){
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
        factoryPlayers.findPlayer(playerId, function(data){
            $scope.player = data;
            console.log("get player data");
        });
        /*factoryPageIdentify.identify(playerId, function(data){
            $scope.pageIdentify = data;
        });*/
        $window.location.href = "/page/";
    }
});
