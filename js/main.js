/**
* @file Main handler and processing code for the webapp.
* @author Dragan Marjanovic <gagalug13@gmail.com>
* @copyright Dragan Marjanovic 2015
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details. 
*/

angular.module('canIDrive', []).controller('MainController', function() {


// Variables

var ethyl_const = 7.89;

var standard_alcohol_removal_factor = 0.015;

var widmark_factor = {
    "male" : 0.7,
    "female" : 0.6
};

var main = this;

// Default User Profile
main.user = { "sex" : "male",
              "weight" : 85.9,
              "bac" : 0.00,
              "drive" : false,
              "time" : 0,
              "color" : "#607D8B"

};

// Preset Drinks
main.drinks = { "Beer" : {"count" : 0,
                          "alcohol_content" : 4.9,
                          "std_volume" : 0.375,
                          "img" : "beer.png"
                         },
                "Wine" : {"count" : 0,
                          "alcohol_content" : 11.6,
                          "std_volume" : 0.15,
                          "img" : "wine.png"
                         },
                "Spirits" : {"count" : 0,
                             "alcohol_content" : 45,
                             "std_volume" : 0.03,
                             "img" : "spirits.png"
                            },
               };



// drink count * volume(ml) * percent-alc * 7.89 = g of alc5

// Core Functions

function bac_calc (consumed_alc, wid_factor, body_mass, removal_fac, time) {
    /** Calculates the Blood Alcohol Content
    * @returns {Number} - Blood Alcohol Content
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

function color_update (bac) {
    /**
    * @todo DO this
    * @todo Do that
    */
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


main.drinkAdd = function(drink){
    /**
    *
    */

    main.drinks[drink]["count"] += 1;
    bac_update();
};

main.drinkRemove = function(drink){
    /** Removes a serving of the selected drink.
    * @param {string} drink - Name/ID of the selected drink.
    * @returns {null}
    */

    // Prevents a negative drink count
    if (main.drinks[drink]["count"] > 0){
        main.drinks[drink]["count"] += -1;
    }
    bac_update();
};


});

