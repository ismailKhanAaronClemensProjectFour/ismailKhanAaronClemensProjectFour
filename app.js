let $userCost= $('#cost');


// namespace
const app = {};


// user selections in namespace
app.userName = "";
app.userSet = "";
app.userClass = "";
app.userRace = "";
app.userType = "";
app.userCost = "";
app.userAttack = "";
app.userHealth = "";

// user single card chosen
app.userCard = {};

// general namespace properties
app.resultsArr = [];
app.cardsFoundTotal = 0;
app.apiUrl = 'https://api.hearthstonejson.com/v1/58638/enUS/cards.collectible.json';
// app.imageUrl = `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`;

// ajax request saved in namespace
app.requestAllCards = $.ajax({
    url: app.apiUrl,
    method: 'GET',
    dataType: 'json'
});

// get all cards from api - method
app.getAllCards = function() {
    app.requestAllCards.then(function(response) {
        // set allCards array to all cards minus the cards with set= HERO_SKINS, these cards are unwanted for this project
        app.allCards = response.filter(function(card) {
            return card.set !== "HERO_SKINS";
        });
        app.resultsArr = app.allCards;
        console.log('all the cards', app.resultsArr); //////// 2nd console log
        $('button[type=submit]').text('Search');
        app.getUserCards();
    });
}

// get user cards from selection - method
app.getUserCards = function() {
    $('form').on('submit', function(e) {
        app.reset();
        app.getSearchValues();
        app.searchCards();
        app.displayCards();
        app.chooseACard();
        e.preventDefault();
    })
}

// rest the results array - method
app.reset = function() {
    app.resultsArr = app.allCards;
}

// get user search values - method
app.getSearchValues = function() {
    app.userName = $('#name').val();
    app.userSet = $('#set').val();
    app.userClass = $('#classes').val();
    app.userRace = $('#race').val();
    app.userType = $('#type').val();
    app.getUserCost();
    app.getUserAttack();
    app.getUserHealth();
    console.log(`Search for: name= ${app.userName} set= ${app.userSet} class= ${app.userClass} race = ${app.userRace} type= ${app.userType} cost= ${app.userCost} attack= ${app.userAttack} health= ${app.userHealth}`);
}    


// get user cost - method
app.getUserCost = function() {
    if($('#cost').val() !== "") {
        app.userCost = parseInt($('#cost').val());
    } else {
        app.userCost = $('#cost').val();
    }
}

// get user attack - method
app.getUserAttack = function() {
    if($('#attack').val() !== "" && $('#attack').val() !== "None") {
        app.userAttack = parseInt($('#attack').val());
    } else {
        app.userAttack = $('#attack').val();
    }
}

// get user health - method
app.getUserHealth = function() {
    if($('#health').val() !== "" && $('#health').val() !== "None") {
        app.userHealth = parseInt($('#health').val());
    } else {
        app.userHealth = $('#health').val();
    }
}

// search for user cards -method
app.searchCards = function() {
    app.cardMatch(app.userName, 'name');
    app.cardMatch(app.userSet, 'set');
    app.cardMatch(app.userClass, 'cardClass');
    app.cardMatch(app.userRace, 'race');
    app.cardMatch(app.userType, 'type');
    app.cardMatch(app.userCost, 'cost');
    app.cardMatch(app.userAttack, 'attack');
    app.cardMatch(app.userHealth, 'health');
    console.log(`selected`, app.resultsArr);
}

// card match filter method
app.cardMatch = function(userChoice, selection) {
    app.resultsArr = app.resultsArr.filter(function(card) {

        if (userChoice === 10) {
            return card[selection] >= 10;
        } else if (userChoice === "None") {
            return card.hasOwnProperty(selection) === false;
        } else {
            return(userChoice !== "" ? card[selection] === userChoice : card[selection] === card[selection]);
        }
    });
}

app.displayCards = function() {
    $('.cardFlexContainer').empty();
    app.updateForm();
    if (app.resultsArr.length !== 0) {
        app.resultsArr.forEach(function(card) {
            const cardImage = $('<img>').attr('src', `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`);
            const userCard = $('<li>').addClass('cardBox').append(cardImage).attr('id',`${card.id}`);
            $('.cardFlexContainer').append(userCard);
        });
    } else {
        const noCardsMessage = $('<p>').addClass('noCards').text('No cards found! Please update search.');
        $('.cardFlexContainer').append(noCardsMessage);
    }
}

app.updateForm = function() {
    app.cardsFoundTotal = app.resultsArr.length;
    $('.cardTotal span').text(app.cardsFoundTotal);
    $('#name').val("");
}

app.chooseACard = function() {
    $('.cardFlexContainer').on('click','li', function() {
        const userCardId = $(this).attr('id')
        console.log(userCardId);
        app.userCard = app.resultsArr.find(function(card){
            return card.id === userCardId;
        });
        console.log(app.userCard);
    });
}

// init method
app.init = function() {
    console.log('initialized'); //////// 1st console log
    // OUR CODE HERE
    app.getAllCards();
}

// document ready
$(document).ready(function() {
    app.init();
});