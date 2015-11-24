gameApp.controller('PagesController', function($scope, $http, factoryPlayers, factoryPageIdentify){

    $scope.player = {};

    $scope.initialData = function(){
        $scope.sections = [];
        $scope.combat = {};
        $scope.decisions = {};
        $scope.ajouterObjets = {};
        $scope.confirmation = '';
        $scope.isConfirm = false;
    }
    $scope.initialData();
    factoryPlayers.currentPlayer(function(data){
        $scope.player = data;
        console.log("current playerId: " + $scope.player._id);
        // get avancement
        $http.get('http://localhost:3000/api/joueurs/avancement/' + $scope.player._id).success(function(data){
            $scope.identify = data;

            //load sections
            for(var i=1; i <= $scope.identify.sectionId; i++){
                $scope.loadSection($scope.identify.pageId, i);
            }
        });
    });

    $scope.loadSection = function(pageId, sectionId){
        $scope.numeroPage = pageId;
        console.log("start load section");
        $http.get("/api/pages/" + pageId + "/" + sectionId + "/").success(function(data){
            $scope.sections.push(data);
            if(data.combat) {
                $scope.combat = angular.copy(data.combat);
            }
            if(data.decision) {
                $http.get(data.decision + '/' + pageId + '/').success(function(data){
                    $scope.decisions =  angular.copy(data);
                });
            }
            if(data.ajouterObjets){
                $scope.ajouterObjets = angular.copy(data.ajouterObjets);
            }
            if(data.confirmation){
                $scope.confirmation = data.confirmation;
            }
        });
        $scope.identify = {pageId: pageId, sectionId: sectionId};
        $scope.avancer(pageId, sectionId);
    }

    $scope.avancer = function(pageId, sectionId) {
        console.log("start update avancement");
        $http.put('http://localhost:3000/api/joueurs/avancement/' + $scope.player._id, {pageId: pageId, sectionId: sectionId})
            .success(function(){
                console.log("update avancement to " + pageId);
            });
    }

    $scope.clickPageLink = function(pageId, sectionId, $index) {
        if($scope.decisions[$index].isValid){
            $scope.loadSection(pageId, sectionId);
        }
        $scope.initialData();
    }

    // for page 12 and 57
    $scope.ajouterSpecialObjets = function(){
        var i = 0;
        var length = $scope.ajouterObjets.items.length;
        console.log(length);
        var isChoose = false;
        for(i; i < length; i++){
            if($scope.ajouterObjets.items[i].checked){
                isChoose = true;
                $scope.player.objetsSpeciaux.push($scope.ajouterObjets.items[i].value);
            }
        }
        // load next section
        $scope.loadSection($scope.identify.pageId, $scope.identify.sectionId + 1);
        if(isChoose) {
            $http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
                console.log("update player data");
            });
        }
    }

    $scope.confirmer = function() {
        $scope.isConfirm = true;
        $http.get($scope.confirmation + '/' + $scope.identify.pageId + '/').success(function(data){});
        $scope.loadSection($scope.identify.pageId, $scope.identify.sectionId+1);
    }
});
