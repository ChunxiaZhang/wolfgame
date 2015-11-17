
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