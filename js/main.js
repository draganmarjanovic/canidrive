angular.module('canIDrive', [])
    .controller('MainController', function() {

var main = this;

main.user = { "gender" : 1,
              "weight" : 100,
              "bac" : 0.01,
              "drive" : false,
              "time" : 1.5

};


main.drinks = { "Beer" : {"count" : 0, "alcohol_percentage" : 0.045},
                "Wine" : {"count" : 0, "alcohol_percentage" : 0.116},
                "Spirits" : {"count" : 0, "alcohol_percentage" : 0.45},
               };


main.drinkAdd = function(type){
    console.log("Test");
    main.drinks[type]["count"] += 1;
};

main.drinkRemove = function(type){
    if (main.drinks[type]["count"] > 0){
        main.drinks[type]["count"] += -1;
    }
};

});

