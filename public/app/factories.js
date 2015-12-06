/**
 * This factory used to get desciplines and equipments
 * */
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
        },
        specialObjectsList: function(callback) {
            $http({
                method: 'GET',
                url: './../json/specialObjects.json'
            }).success(callback);
        },
        constantes: function(callback) {
            $http({
                method: 'GET',
                url:'/constantes/'
            }).success(callback);
        }
    };
});

/**
 * This factory used to get all players
 * or get one player
 * or delete one player
 * or get current player info in session
 * */
gameApp.factory('factoryPlayers', function($http){
    return {
        list: function(callback) {
            $http({
                method: 'GET',
                url:'/api/joueurs/'
            }).success(callback);
        },
        findPlayer: function(id, callback) {
            $http({
                method: 'GET',
                url: '/api/joueurs/'+ id
            }).success(callback);
        },
        deletePlayer: function(id, callback) {
            $http({
                method: 'DELETE',
                url: '/api/joueurs/' + id
            }).success(callback);
        },
        currentPlayer: function(callback) {
            $http({
                method: 'GET',
                url: '/api/joueurs/currentPlayer/'
            }).success(callback);
        }
    };
});

/**
 * This factory used to get a section info of a page,
 *  get decision
 *  get perte
 * */
gameApp.factory('factoryPages', function($http){
    return {
        page: function(pageId, sectionId, callback){
            $http({
                method: 'GET',
                url: '/api/pages/' + pageId + '/' + sectionId + '/'
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
                url: '/api/pages/confirmation/' + pageId + '/'
            }).success(callback);
        }
    };
});

gameApp.factory('factoryCombatResult', function($http){
    return {
        result: function(ej, hj, em, hm, callback) {
            $http({
                method: 'GET',
                url:'/api/combat/' + ej + '/' + hj + '/' + em + '/' + hm + '/'
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
                url:'/api/joueurs/avancement/' + playerId
            }).success(callback);
        }
    };
});