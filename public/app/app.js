var gameApp = angular.module('gameApp', [
    'ngMessages',
    'ngRoute'
])

gameApp.controller("playersListCtrl", function($scope, $http, factoryPlayers){
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
            });
    }
});

gameApp.controller('PageController', function($scope, $routeParams, $http){

    $scope.loadPage = function(pageId, sectionId) {

        $http.get("/api/pages/" + pageId + "/" + sectionId + "/")
            .success(function (data) {
                $scope.contenu = data.contenu;
                console.log($scope.contenu);
            });
    }


    $scope.loadPage(12, 1);
});


gameApp.factory('factoryProperties', function($http){
    return {
        disciplinesList: function(callback){
            $http({
                method: 'GET',
                url: './../json/disciplines.json',
                cache: true
            }).success(callback);
        },
        equipmentsList: function(callback){
            $http({
                method: 'GET',
                url: './../json/equipments.json',
                cache: true
            }).success(callback);
        }
    };
});

gameApp.factory('factoryPlayers', function($http){
    return {
        list: function(callback) {
            $http({
                method: 'GET',
                url:'http://localhost:3000/api/joueurs/',
                cache: true
            }).success(callback);
        },
        findRecord: function(id, callback) {
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/joueurs/'+ id,
                cache: true
            }).success(callback);
        },
        deletePlayer: function(id, callback) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:3000/api/joueurs/' + id,
                cache: false
            }).success(callback);
        }
    };
});