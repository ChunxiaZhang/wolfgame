var formController = angular.module('formController',[]);
formController.controller('formController', function($scope, $http, $window, factoryProperties) {

    $scope.newPlayerName = "";
    $scope.isWholeFormValid = true;
    factoryProperties.disciplinesList(function (disciplines) {
        $scope.disciplinesScope = disciplines;
    });
    factoryProperties.equipmentsList(function (equipments) {
        $scope.equipmentsScope = equipments;
    });

    $scope.formValidator = {
        isWholeFormValid: false,
        isDiscCheckedValid: false,
        isEquipCheckedValid: false,
        isMoreThan5: false,
        isMoreThan2: false,
        getCheckedNum: function(items) {
            return items.reduce(function(pv, cv) {
                return cv.checked ? pv + 1 : pv + 0;
            }, 0);
        },
    };

    $scope.changeDiscStatus = function(index){
        var num = $scope.formValidator.getCheckedNum($scope.disciplinesScope);
        console.log("num: " + num);

        if (num > 5) {
            $scope.formValidator.isMoreThan5 = true;
            console.log($scope.formValidator.isMoreThan5);
            $scope.disciplinesScope[index].checked = false;
            num -= 1;
        } else {
            $scope.formValidator.isMoreThan5 = false;
        }

        if (num == 5) {
            $scope.formValidator.isDiscCheckedValid = true;
        } else {
            $scope.formValidator.isDiscCheckedValid = false;
        }
    };
});