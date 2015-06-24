angular.module('canIDrive', [])
    .controller('MainController', function() {


// Variables

var ethyl_const = 7.89;

var standard_alcohol_removal_factor = 0.015;

var widmark_factor = {
    "male" : 0.7,
    "female" : 0.6
};

var main = this;

main.user = { "sex" : "male",
              "weight" : 85.9,
              "bac" : 0.00,
              "drive" : false,
              "time" : 0

};


main.drinks = { "Beer" : {"count" : 0, "alcohol_content" : 4.9, "std_volume" : .375, "img" : "beer.png"},
                "Wine" : {"count" : 0, "alcohol_content" : 11.6, "std_volume" : .15, "img" : "wine.png"},
                "Spirits" : {"count" : 0, "alcohol_content" : 45, "std_volume" : .03, "img" : "spirits.png"},
               };



// drink count * volume(ml) * percent-alc * 7.89 = g of alc5

// Core Functions

function bac_calc (consumed_alc, wid_factor, body_mass, removal_fac, time) {
    /*Calculates the Blood Alcohol Content
    bac_calc() -> float
    */
    var b = (((consumed_alc/(wid_factor*body_mass))*100)-(removal_fac*time));

    return (b);
}


function bac_update () {
    // Variable Preparation
    consumed_alc = 0;

    for (var key in main.drinks) {
        consumed_alc += main.drinks[key]["count"] * main.drinks[key]["std_volume"] * main.drinks[key]["alcohol_content"] * ethyl_const;
    }

    // main.user["bac"] = consumed_alc;
    wid_factor = widmark_factor[main.user["sex"]];
    body_mass = main.user["weight"]*1000; // Covered
    removal_fac = standard_alcohol_removal_factor; // Covered
    time = main.user["time"]; // Covered
    bac = bac_calc(consumed_alc, wid_factor, body_mass, removal_fac, time); // Covered
    main.user["bac"] = bac.toFixed(3);
}

// Handlers


main.newDrink = function(){
    // drink_ID = main.drinks.length;
    drink_ID = Object.keys(main.drinks).length;
    console.log(drink_ID);
    main.drinks[drink_ID] = {"count" : 0, "alcohol_content" : 45, "std_volume" : 0.03, "img" : "defaults.png"};
};

main.setSex = function(sex){
    main.user["sex"] = sex;
    bac_update();
};       

main.setAlcoholContent = function(drink_ID, content){
    if (content < 0 || isNaN(content)) {
        main.drinks[drink_ID]["alcohol_content"] = main.drinks[drink_ID]["alcohol_content"];
    }
    else{
        main.drinks[drink_ID]["alcohol_content"] = content;
    }
    console.log(drink_ID);
    console.log(content);
    bac_update();
};

main.setAlcoholVolume = function(drink_ID, volume){
    volume = volume/1000;
    if (volume < 0 || isNaN(volume)) {
       main.drinks[drink_ID]["std_volume"] = main.drinks[drink_ID]["std_volume"]; 
    }
    else{
       main.drinks[drink_ID]["std_volume"] = volume;
    }
    console.log(drink_ID);
    console.log(volume);
    bac_update();
};

main.setWeight = function (weight){
    // Sets the weight
    if (weight < 0 || isNaN(weight)) {
        main.user["weight"] = main.user["weight"];
    }
    else{
        main.user["weight"] = weight;
    }
    bac_update();
};

main.setTime = function (elapsed_time) {
    if (elapsed_time < 0 || isNaN(elapsed_time)) {
        main.user["time"] = main.user["time"];
    }else{
        main.user["time"] = elapsed_time;
    }
    bac_update();
};


    main.drinkAdd = function(type){
        /* Increments the drink count for a particular drink.

        */
        main.drinks[type]["count"] += 1;
        bac_update();
    };

    main.drinkRemove = function(type){
        if (main.drinks[type]["count"] > 0){
            main.drinks[type]["count"] += -1;
        }
        bac_update();
    };


});

