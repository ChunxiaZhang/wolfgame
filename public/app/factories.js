
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
        findPlayer: function(id, callback) {
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
        },
        currentPlayer: function(callback) {
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/joueurs/currentPlayer/',
                cache: true
            }).success(callback);
        }
    };
});

gameApp.factory('factoryPages', function($http){
    return {
        page: function(pageId, sectionId, callback){
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/pages/' + pageId + '/' + sectionId + '/',
                cash: true
            }).success(callback);
        },
        decision: function(pageId, callback){
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/pages/decision/' + pageId + '/',
                cash: true
            }).success(callback);
        },
        decisionAleatoire: function(pageId, callback){
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/pages/choixAleatoire/' + pageId + '/',
                cash: true
            }).success(callback);
        }
    };
});

gameApp.factory('factoryCombatResult', function($http){
    return {
        result: function(ej, hj, em, hm, callback) {
            $http({
                method: 'GET',
                url:'http://localhost:3000/api/combat/' + ej + '/' + hj + '/' + em + '/' + hm + '/',
                cash: true
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
                url:'http://localhost:3000/api/joueurs/avancement/' + playerId,
                cash: true
            }).success(callback);
        }
    };
});