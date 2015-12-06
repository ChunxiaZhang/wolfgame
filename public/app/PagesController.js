/**
 * Created by Zoe on 2015-11-16.
 * This controller used to load sections of different pages
 * After load new section or turn to new page, need to update avancement data in DB
 * Confirm which parts should be showed or loaded
 * Get section text
 * Get decisions
 * Get combat info, show combat part if there is a combat
 * Get confirm info, show confirm according specific situations
 * Let player choose special objects if it is necessary, and add new objects to DB when confirm
 * If there is lost, need to get lost from server api, and show message to player which lost he got, and update player data
 * When player click one link from decision part, need load new page data, and update avancement
 *
 */
gameApp.controller('PagesController', ['$scope', '$http', 'ModalService', 'factoryPlayers', 'factoryProperties',
    function($scope, $http, ModalService, factoryPlayers, factoryProperties){
        $scope.player = {};
        factoryProperties.constantes(function(constantes){
            $scope.constantes = constantes;
        });

    $scope.initialData = function(){
        $scope.sections = [];
        $scope.combat = {};
        $scope.decisions = {};
        $scope.ajouterObjets = {};
        $scope.confirmation = '';
        $scope.isConfirm = false;
        $scope.needConfirm = false;
        $scope.isAjoute = false;
    }
    $scope.initialData();
    factoryPlayers.currentPlayer(function(data){
        $scope.player = data;
        console.log("current playerId: " + $scope.player._id);

        // get avancement
        $http.get('/api/joueurs/avancement/' + $scope.player._id).success(function(data){
            $scope.identify = data;

            //load sections
            for(var i=1; i <= $scope.identify.sectionId; i++){
                $scope.loadSection($scope.identify.pageId, i);
            }
        });
    });

    $scope.updatePlayer = function() {
        $http.put('/api/joueurs/'+ $scope.player._id, $scope.player).success(function(){
            console.log("update player data");
        });
    }

    $scope.loadSection = function(pageId, sectionId){

        $scope.numeroPage = pageId;
        $http.get("/api/pages/" + pageId + "/" + sectionId + "/").success(function(data){

            $scope.sections.push(data);
            // if there is combat, for page 78
            if(data.combat) {
                $scope.combat = angular.copy(data.combat);
            }
            if(data.decision) {
                $http.get(data.decision + '/' + pageId + '/').success(function(data){
                    $scope.decisions =  angular.copy(data);
                });
            }
            // if it needs to add objects, for page 57, 12
            if(data.ajouterObjets){
                $scope.ajouterObjets = angular.copy(data.ajouterObjets);

                // If the items already in DB, then do not show it
                var i = 0;
                var length = $scope.ajouterObjets.items.length;
                for(i; i < length; i++){
                    try{
                        if($scope.ajouterObjets.items[i].type == "objetSpecial" && $scope.player.objetsSpeciaux.indexOf($scope.ajouterObjets.items[i].value) >= 0){
                            $scope.ajouterObjets.items[i].isOwn = true;
                        }
                        if($scope.ajouterObjets.items[i].type == "objet" && $scope.player.objets.indexOf($scope.ajouterObjets.items[i].value) >= 0){
                            $scope.ajouterObjets.items[i].isOwn = true;
                        }
                    }catch(e){
                        console.log("not fine item property",e)
                    }

                }
            }
            // if it needs to confirm, for page 331, 129, 209
            if(data.confirmation){
                $scope.confirmation = data.confirmation;
            }
        });
        $scope.identify = {pageId: pageId, sectionId: sectionId};
        // for page 91, need to confirm special object is added
        if(pageId == 91){
            //huileBakanal
            var huileBakanal = $scope.constantes.objetSpecial.HUILE_DE_BAKANAL;
            if($scope.player.objetsSpeciaux.indexOf(huileBakanal) < 0) {
                $scope.needConfirm = true;
                $scope.player.objetsSpeciaux.push(huileBakanal);
                $scope.updatePlayer();
                $scope.confirmMessage = "L'huile de Bakanal a été ajoutée dans ses objets spéciaux.";
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
        $http.put('/api/joueurs/avancement/' + $scope.player._id, {pageId: pageId, sectionId: sectionId})
            .success(function(){
                console.log("update avancement to page:" + pageId + " sectionId: " + sectionId);
            });
    }

    $scope.clickPageLink = function(pageId, sectionId, $index) {
        if($scope.decisions[$index].isValid){
            // turn to another page, clear decisionPossible in DB
            $http.put('/api/joueurs/avancement/' + $scope.player._id, {decisionPossible: []})
                .success(function(){
                    console.log("update avancement to page:" + pageId + " sectionId: " + sectionId);
                });
            $scope.loadSection(pageId, sectionId);
            $scope.initialData();
        }
    }

    // for page 12 and 57
    $scope.ajouterObjetsAction = function(){
        $scope.isAjoute = true;
        var i = 0;
        var length = $scope.ajouterObjets.items.length;
        var isUpdate = false;
        for(i; i < length; i++){
            if($scope.ajouterObjets.items[i].checked){
                var item = $scope.ajouterObjets.items[i];
                if(item.type == "objetSpecial" && $scope.player.objetsSpeciaux.indexOf(item.value) < 0){
                    $scope.player.objetsSpeciaux.push(item.value);
                    isUpdate = true;
                }
                if(item.type == "objet" && $scope.player.objets.indexOf(item.value) < 0){
                    $scope.player.objets.push(item.value);
                    isUpdate = true;
                }

            }
        }
        // load next section
        $scope.identify.sectionId += 1;
        $scope.loadSection($scope.identify.pageId, $scope.identify.sectionId);
        if(isUpdate) {
            $scope.updatePlayer();
        }
    }

    // for page 12, 129, 155, 209, 331 that have lost
    $scope.confirmer = function() {
        $scope.isConfirm = true;
        $http.get($scope.confirmation + '/' + $scope.identify.pageId + '/').success(function(data){
            //alert(data.message);
            $scope.confirmMessage = data.message;
            $scope.showConfirmModal();
            $scope.player = data.joueur; // update player data
            $scope.updatePlayer(); // update DB
            var link = data.lien; //"/page/129/2"
            var res = link.split("/");
            var len = res.length;
            $scope.loadSection(res[len-2], res[len-1]);
        });

    }

    // confirm dialog
    $scope.showConfirmModal = function() {
        //var scope = $scope.$new({confirmMessage: $scope.confirmMessage});
        ModalService.showModal({
            templateUrl: "/templates/confirm.html",
            inputs:{
                confirmMessage: $scope.confirmMessage
            },
            controller: ['$scope', 'close','confirmMessage', function($scope, close, confirmMessage) {
                $scope.confirmMessage = confirmMessage;
                $scope.close = function(result) {
                    close(result, 500);

                };
            }]
        }).then(function(modal){
            modal.element.modal();
            modal.close.then(function(result){
                $scope.needConfirm = false;
            });
        });
    }
}]);


