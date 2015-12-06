/**
 * Created by Zoe on 2015-11-16.
 * This controller used to get all the players in DB, and show the player list in the game create page
 * Players can be deleted
 * Click one of payer in the list, restart this player's game
 */
gameApp.controller("PlayersListCtrl", function($scope, $http, $window, factoryPlayers){
    // get player list
    factoryPlayers.list(function(dbPlayers){
        $scope.dbPlayers = dbPlayers;
    });

    // when click delete button, delete player in DB
    $scope.deletePlayer = function(playerId) {
        factoryPlayers.deletePlayer(playerId, function () {
            var i = 0;
            var length = $scope.dbPlayers.length;
            var index;
            for (i; i < length; i++) {
                if (playerId == $scope.dbPlayers[i]._id) {
                    index = i;
                }
            }
            $scope.dbPlayers.splice(index, 1);
        });
    }

    // click one player from list, restart game of this player
    $scope.restart = function(playerId) {
        factoryPlayers.findPlayer(playerId, function(data){
            $scope.player = data;
        });
        $window.location.href = "/page/";
    }
});
