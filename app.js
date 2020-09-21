// globals
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
    return ($('#cost').val() !== "" ? app.userCost = parseInt($('#cost').val()) : app.userCost = $('#cost').val());
}

// get user attack - method
app.getUserAttack = function() {
    return ($('#attack').val() !== "" && $('#attack').val() !== "None" ? app.userAttack = parseInt($('#attack').val()) : app.userAttack = $('#attack').val());
}
 
// get user health - method
app.getUserHealth = function() {
    // if($('#health').val() !== "" && $('#health').val() !== "None") {
    //     app.userHealth = parseInt($('#health').val());
    // } else {
    //     app.userHealth = $('#health').val();
    // }

    return ($('#health').val() !== "" && $('#health').val() !== "None" ? app.userHealth = parseInt($('#health').val()) : app.userHealth = $('#health').val());
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
            const cardImage = $('<img>').addClass('cardImg').attr('src', `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`);
            const userCard = $('<li>').addClass('cardBox').append(cardImage).attr({'id':`${card.id}`,'tabindex':0});
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

// on click of card in display results, show clicked card in the infoCol
app.chooseACard = function() {
    $('.cardFlexContainer').on('click','li', function() {
        $('.chosenCard').empty();

        const userCardId = $(this).attr('id');
        const userCardUrl = `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${userCardId}.png`;
        
        app.userCard = app.resultsArr.find(function(card){
            return card.id === userCardId;
        });
        
        app.updateSetName();
        app.displayCardProperties(userCardUrl);
    });
}

app.displayCardProperties = function(url) {
    // display properties
    const cardName = $('#cardName').text(app.userCard.name);
    const cardCost = $('#cardCost').text(app.userCard.cost);
    const cardAttack = $('#cardAttack').text(app.userCard.attack);
    const cardHealth = $('#cardHealth').text(app.userCard.health);
    const type = $('#cardType').text(app.userCard.type);
    const rarity = $('#rarity').text(app.userCard.rarity);
    const cardID = $('#id').text(app.userCard.id);
    const artist = $('#artist').text(app.userCard.artist);
    const flavour = $('#flavour').text(app.userCard.flavor);

    const selectedImg = $('<img>').addClass('selectedImg unhide').attr('src', url);
    $('.chosenCard').append(selectedImg);

    $('span').append(cardID, flavour, artist, xpac, cardName, type, rarity, cardCost, cardAttack, cardHealth);
}

// update set name 
app.updateSetName = function() {
    app.setName = []
    $('#set option').each(function(){
        if ($(this).val() === app.userCard.set) {
            app.setName.push($(this).text());
        }
    });
    const xpac = $('#xpac').text(app.setName[0]);
};

// init method
app.init = function() {
    console.log('initialized'); //////// 1st console log
    // OUR CODE HERE
    app.getAllCards();
    app.chooseACard();
}

// document ready
$(document).ready(function() {
    app.init();
});