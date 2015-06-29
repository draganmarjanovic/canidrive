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

var main = this;

// Variables

var ETHYL_CONSTANT = 7.89;

var STANDARD_ALCOHOL_REMOVAL_FACTOR = 0.015;

var WIDMARK_FACTOR = {
    "male" : 0.7,
    "female" : 0.6
};

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
                          "alcoholContent" : 4.9,
                          "standardVolume" : 0.375,
                          "img" : "beer.png"
                         },
                "Wine" : {"count" : 0,
                          "alcoholContent" : 11.6,
                          "standardVolume" : 0.15,
                          "img" : "wine.png"
                         },
                "Spirits" : {"count" : 0,
                             "alcoholContent" : 45,
                             "standardVolume" : 0.03,
                             "img" : "spirits.png"
                            },
               };

// Core Functions

function bac_calc (consumedAlc, widFactor, bodyMass, removalFac, time) {
    /** Calculates the Blood Alcohol Content
    * @params {float} consumedAlc - Consumed alcohol in grams
    * @params {float} widFactor - Average constants
    * @params {float} bodyMass - Body mass in kg
    * @params {float} removalFac - Alcohol Removal Constant
    * @params {float} time - Time in hours since drinking started.

    * @returns {float} - Blood Alcohol Content
    */

    var bac = (((consumedAlc/(widFactor*bodyMass))*100)-(removalFac*time));
    return (bac);
}


function bac_update () {
    /** Updates the Blood Alcohol Content
    * @return {null}
    */
    consumedAlc = 0;

    for (var key in main.drinks) {
        consumedAlc += main.drinks[key]["count"] *
                       main.drinks[key]["standardVolume"] *
                       main.drinks[key]["alcoholContent"] * ETHYL_CONSTANT;
    }

    widFactor = WIDMARK_FACTOR[main.user["sex"]];
    bodyMass = main.user["weight"]*1000;
    removalFac = STANDARD_ALCOHOL_REMOVAL_FACTOR;
    time = main.user["time"];
    bac = bac_calc(consumedAlc, widFactor, bodyMass, removalFac, time);
    main.user["bac"] = bac.toFixed(3);
}


// Handler functions

main.newDrink = function(){
    /** Adds a drink for the user to enter custom options and properties.
    * @returns {null}
    */
    drinkID = Object.keys(main.drinks).length;
    main.drinks[drinkID] = {"count" : 0,
                            "alcoholContent" : 45,
                            "standardVolume" : 0.03,
                            "img" : "default.png"
                           };
};

main.setSex = function(sex){
    /** Updates the user sex for BAC calculation.
    * @param {string} sex - male/female
    * @returns {null}
    */
    main.user["sex"] = sex;
    bac_update();
};

main.setAlcoholContent = function(drinkID, content){
    /** Sets alcohol content for a selected drink.
    * @param {string} drinkID - Drink key.
    * @returns {null}
    */
    if (content > 0 && isNaN(content) === false) {
        main.drinks[drinkID]["alcoholContent"] = content;
    }
    bac_update();
};

main.setAlcoholVolume = function(drinkID, volume){
    /** Sets alcohol volume for a particular drink.
    * @param {string} drinkID - Drink key.
    * @returns {null}
    */
    volume = volume/1000;
    if (volume > 0 && isNaN(volume) === false) {
        main.drinks[drinkID]["standardVolume"] = volume;
    }
    bac_update();
};

main.setWeight = function (weight){
    /** Sets the user weight.
    * @param {float} weight - User weight in kg
    * @returns {null}
    */
    if (weight < 0 || isNaN(weight)) {
        main.user["weight"] = main.user["weight"];
    }
    else{
        main.user["weight"] = weight;
    }
    bac_update();
};

main.setTime = function (elapsedTime) {
    /** Sets the elapsed time.
    * @param {float} elapsedTime - Elapsed time in hours.
    * @returns {null}
    */
    if (elapsedTime < 0 || isNaN(elapsedTime)) {
        main.user["time"] = main.user["time"];
    }else{
        main.user["time"] = elapsedTime;
    }
    bac_update();
};

main.drinkAdd = function(drink){
    /** Adds a serving of the selected drink.
    * @param {string} drink - Name/ID of the selected drink
    * @returns {null}
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

