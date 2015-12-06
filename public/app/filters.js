/**
 * This filter used to confirm if an object has own property
 * */
gameApp.filter('haveProperty', function(){
    var bar;
    return function (obj) {
        for (bar in obj) {
            if (obj.hasOwnProperty(bar)) {
                return true;
            }
        }
        return false;
    };
});
