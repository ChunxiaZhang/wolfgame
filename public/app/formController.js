/**
 * This controller used to validate create new player form,
 * and create new player, save to the DB
 * */
gameApp.controller('FormController',['$scope', '$http', '$window', 'factoryProperties', function($scope, $http, $window, factoryProperties) {

    $scope.newPlayerName = "";
    // get disciplines to show in the form
    factoryProperties.disciplinesList(function(disciplines) {
        $scope.disciplinesScope = disciplines;
    });
    // get equipments to show in the form
    factoryProperties.equipmentsList(function (equipments) {
        $scope.equipmentsScope = equipments;
    });
    factoryProperties.constantes(function(constantes){
        $scope.constantes = constantes;
    });

    /**
     * validator: need to valid checked disciplines, checked equipments,
     * if weapon skill is checked, if not, can not choose weapons
     * */
    $scope.formValidator = {
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

    /**
    * if change status of check box, need to confirm if already choose maximum items,
     * if already already choose maximum items, need to cancel check action, and give message to player
    * */
    $scope.changeDiscStatus = function(index){
        var num = $scope.formValidator.getCheckedNum($scope.disciplinesScope);

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
        for(var i = 0; i<$scope.disciplinesScope.length; i++) {
            //maitriseArmes
            if ($scope.disciplinesScope[i].value == $scope.constantes.discipline.MAITRISE_ARMES && $scope.disciplinesScope[i].checked) {
                return true;
            }
        }
        return false;
    }

    $scope.validWeaponSkill = function() {
        if (!$scope.isWeaponSkillChecked() && $scope.getArmeValues().length > 0) {
            $scope.formValidator.isWeaponSkillValid = false;
        }else {
            $scope.formValidator.isWeaponSkillValid = true;
        }
    }

    /**
     * if change status of check box, need to confirm if already choose maximum items,
     * if already already choose maximum items, need to cancel check action, and give message to player
     * */
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
            if(obj.checked && obj.name=="objets") {
                values.push(obj.value);
            }
        });
        console.log("objets: " + values);
        return values;
    }
    $scope.getObjetsSpeciauxValues = function() {
        var values = [];
        $scope.equipmentsScope.forEach(function(obj){
            if(obj.checked && obj.name=="objetsSpeciaux") {
                values.push(obj.value);
            }
        });
        console.log("objetsSpeciaux: " + values);
        return values;
    }

    // create new player
    $scope.player = function(){
        return {
            playerName:$scope.newPlayerName,
            disciplines:$scope.getDisciplineValues(),
            armes:$scope.getArmeValues(),
            objets:$scope.getObjetsValues(),
            objetsSpeciaux:$scope.getObjetsSpeciauxValues()
        };
    }

    /**
     * Click submit button, first need to confirm validation, if valid create and save player to DB and turn to game play page;
     * if not valid, cannot create new player and give player message,
     * */
    $scope.submitForm = function(inputValid) {
        $scope.validWeaponSkill();
        if (inputValid && $scope.formValidator.isDiscCheckedValid &&
            $scope.formValidator.isEquipCheckedValid && $scope.formValidator.isWeaponSkillValid) {

            // if form valid, save the new player to DB
            $http.post('/createPlayer', $scope.player())
                .success(function(){
                    $window.location.href = "/page/";
                });
        } else {
            var message = "";
            if(!inputValid) {
                message = "Player name is not valid!"
            } else if(!$scope.formValidator.isDiscCheckedValid) {
                message = "Disciplines were not checked correctly!"
            } else if(!$scope.formValidator.isEquipCheckedValid) {
                message = "Equipments were not checked correctly!"
            } else if(!$scope.formValidator.isWeaponSkillValid) {
                message = "You can not choose armes because you didn't choose 'La Maîtrise des Armes'!";
            }
            alert(message);
        }
    }

}]);