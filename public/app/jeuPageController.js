/**
 * Created by Zoe on 2015-11-16.
 */
gameApp.controller('jeuPageController', function($scope, $routeParams, $http){

    $scope.numeroPage = 1;
    $scope.loadPage = function(pageId, sectionId) {
        $scope.numeroPage = pageId;
        $http.get("/api/pages/" + pageId + "/" + sectionId + "/")
            .success(function (data) {
                $scope.contenu = data.contenu;
                console.log($scope.contenu);
            });
        $http.get("/api/pages/decision/" + pageId + "/")
            .success(function(data){
                $scope.decision = data;
            });
    }
    $scope.loadPage(1, 1);

});