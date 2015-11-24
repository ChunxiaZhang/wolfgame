
gameApp.factory('factoryProperties', function($http){
    return {
        disciplinesList: function(callback){
            $http({
                method: 'GET',
                url: './../json/disciplines.json'
            }).success(callback);
        },
        equipmentsList: function(callback){
            $http({
                method: 'GET',
                url: './../json/equipments.json'
            }).success(callback);
        }
    };
});


gameApp.factory('factoryPlayers', function($http){
    return {
        list: function(callback) {
            $http({
                method: 'GET',
                url:'http://localhost:3000/api/joueurs/'
            }).success(callback);
        },
        findPlayer: function(id, callback) {
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/joueurs/'+ id
            }).success(callback);
        },
        deletePlayer: function(id, callback) {
            $http({
                method: 'DELETE',
                url: 'http://localhost:3000/api/joueurs/' + id
            }).success(callback);
        },
        currentPlayer: function(callback) {
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/joueurs/currentPlayer/'
            }).success(callback);
        }
    };
});

gameApp.factory('factoryPages', function($http){
    return {
        page: function(pageId, sectionId, callback){

            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/pages/' + pageId + '/' + sectionId + '/'
            }).success(callback);
        },
        decision: function(url, pageId, callback){
            console.log("url: " + url);
            $http({
                method: 'GET',
                url: url + '/' + pageId + '/'
            }).success(callback);
        },
        perte: function(pageId, callback){
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/pages/confirmation/' + pageId + '/'
            }).success(callback);
        }
    };
});

gameApp.factory('factoryCombatResult', function($http){
    return {
        result: function(ej, hj, em, hm, callback) {
            $http({
                method: 'GET',
                url:'http://localhost:3000/api/combat/' + ej + '/' + hj + '/' + em + '/' + hm + '/'
            }).success(callback);
        }
    };
});

gameApp.factory('factoryPageIdentify', function($http){
    return {
        identify: function(playerId, callback) {
            console.log("get identify");
            $http({
                method: 'GET',
                url:'http://localhost:3000/api/joueurs/avancement/' + playerId
            }).success(callback);
        }
    };
});