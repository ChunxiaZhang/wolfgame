
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

gameApp.factory('pageIdentify', function(){
    var identify = {
        pageId: 1,
        sectionId: 1
    };
    return {
        getPageId: function() {
            console.log(" get identify.pageId: " + identify.pageId);
            return identify.pageId;
        },
        setPageId: function(id) {

           identify.pageId = id;
            console.log("identify.pageId: " + identify.pageId);
        },
        getSectionId: function() {
            console.log("get identify.sectionId: " + identify.sectionId);
            return identify.sectionId;
        },
        setSectionId: function(id) {
            identify.sectionId = id;
            console.log("identify.sectionId: " + identify.sectionId);
        }
    };
});