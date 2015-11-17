gameApp.controller('formController', function($scope, $http, $window, factoryProperties) {

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
        isWeaponSkillValid: true,
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

    $scope.isWeaponSkillChecked = function() {
        for(var i = 0; i < $scope.disciplinesScope; i++) {
            if ($scope.disciplinesScope[i].value == "maitriseArmes" && $scope.disciplinesScope[i].checked) {
                return true;
            }
        }
        return false;
    }

    $scope.validWeaponSkill = function() {
        if ($scope.isWeaponSkillChecked() && $scope.getArmeValues().length > 0) {
            $scope.formValidator.isWeaponSkillValid = false;
        }else {
            $scope.formValidator.isWeaponSkillValid = true;
        }
    }

    $scope.changeEquipStatus = function(index){
        var num = $scope.formValidator.getCheckedNum($scope.equipmentsScope);
        $scope.formValidator.isWeaponSkillValid = true;

        if (num > 2) {
            $scope.formValidator.isMoreThan2 = true;
            $scope.equipmentsScope[index].checked = false;
            num -= 1;
        } else {
            $scope.formValidator.isMoreThan2 = false;
        }


        if (num == 2) {
            $scope.formValidator.isEquipCheckedValid = true;
            $scope.validWeaponSkill();

        } else {
            $scope.formValidator.isEquipCheckedValid = false;
        }
    };

    $scope.getDisciplineValues = function() {
        var disciplineValue = [];
        $scope.disciplinesScope.forEach(function(obj){
            if(obj.checked) {
                disciplineValue.push(obj.value);
            }
        });
        return disciplineValue;
    }
    $scope.getArmeValues = function() {

        var values = [];
        $scope.equipmentsScope.forEach(function(obj){
            if(obj.checked && obj.name=="arme") {
                values.push(obj.value);
            }
        });
        return values;
    }
    $scope.getObjetsValues = function() {

        var values = [];
        $scope.equipmentsScope.forEach(function(obj){
            if(obj.checked && obj.name=="objet") {
                values.push(obj.value);
            }
        });
        return values;
    }
    $scope.getObjetsSpeciauxValues = function() {

        var values = [];
        $scope.equipmentsScope.forEach(function(obj){
            if(obj.checked && obj.name=="objetSpecial") {
                values.push(obj.value);
            }
        });
        return values;
    }

    $scope.player = function(){
        return {
            playerName:$scope.newPlayerName,
            disciplines:$scope.getDisciplineValues(),
            armes:$scope.getArmeValues(),
            objets:$scope.getObjetsValues(),
            objetsSpeciaux:$scope.getObjetsSpeciauxValues()
        };
    }

    $scope.submitForm = function(inputValid) {

        if (inputValid && $scope.formValidator.isDiscCheckedValid &&
            $scope.formValidator.isEquipCheckedValid && $scope.formValidator.isWeaponSkillValid) {
            console.log("$scope.player:" + $scope.player().playerName);
            console.log($scope.player().disciplines);
            console.log($scope.player().armes);
            console.log($scope.player().objets);
            console.log($scope.player().objetsSpeciaux);

            $http.post('/jeu/1', $scope.player())
                .success(function(){
                    //$window.location.href = "/jeu/1";
                });
        } else {
            alert("Form is not valid!");
        }
    }

});