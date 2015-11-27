gameApp.controller('PagesController', ['$scope', '$http', 'ModalService', 'factoryPlayers', function($scope, $http, ModalService, factoryPlayers){

    $scope.player = {};

    $scope.initialData = function(){
        $scope.sections = [];
        $scope.combat = {};
        $scope.decisions = {};
        $scope.ajouterObjets = {};
        $scope.confirmation = '';
        $scope.isConfirm = false;
        $scope.isAjoute = false;
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

    $scope.updatePlayer = function() {
        $http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
            console.log("update player data");
        });
    }

    $scope.loadSection = function(pageId, sectionId){

        $scope.numeroPage = pageId;
        console.log("start load section: " + sectionId);
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
        if(pageId == 91){
            if($scope.player.objetsSpeciaux.indexOf("huileBakanal") < 0) {
                console.log("no huile Bakanal ");
                $scope.player.objetsSpeciaux.push("huileBakanal");
                $scope.updatePlayer();
                /*$http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
                    console.log("update player data");
                });*/
                $scope.showConfirmModal();
            }

        }
        if(pageId == 339 || pageId == 248) {
            factoryPlayers.deletePlayer($scope.player._id, function(){
                console.log("delete player:" + $scope.player._id);
            });
        } else {
            $scope.avancer(pageId, sectionId);
        }

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
        $scope.isAjoute = true;
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
        $scope.identify.sectionId += 1;
        $scope.loadSection($scope.identify.pageId, $scope.identify.sectionId);
        if(isChoose) {
            $scope.updatePlayer();
            /*$http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
                console.log("update player data");
            });*/
        }
    }

    $scope.confirmer = function() {
        $scope.isConfirm = true;
        $http.get($scope.confirmation + '/' + $scope.identify.pageId + '/').success(function(data){});
        $scope.loadSection($scope.identify.pageId, $scope.identify.sectionId+1);
    }

    $scope.test = "test message";
    $scope.showConfirmModal = function() {
        ModalService.showModal({
            templateUrl: "/templates/confirm.html",
            controller: ['$scope', 'close', function($scope, close) {
                $scope.close = function(result) {

                    close(result, 500);

                };
            }]
        }).then(function(modal){
            modal.element.modal();
            modal.close.then(function(result){
                /*if (result) {
                    console.log("update special objects:"+$scope.player.objetsSpeciaux);
                    if($scope.player.objetsSpeciaux.indexOf("huileBakanal") < 0) {
                        $scope.player.objetsSpeciaux.push("huileBakanal");
                    }
                    $http.put('http://localhost:3000/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
                        console.log("update player data");
                    });
                }*/

            });
        });
    }
}]);

