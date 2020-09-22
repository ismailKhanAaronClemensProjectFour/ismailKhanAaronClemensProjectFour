// cached selectors
const $userCost = $('#cost');
const $userAttack = $('#attack');
const $userHealth = $('#health');
const $searchButton = $('button[type=submit]');
const $cardsFound = $('.cardTotal span');
const $infoCol = $('.infoCol');

// namespace object
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

// ajax request saved in namespace
app.requestAllCards = $.ajax({
    url: app.apiUrl,
    method: 'GET',
    dataType: 'json'
});

// get all cards from api - method
app.getAllCards = function() {
    app.requestAllCards.then(function(response) {
        // set allCards array to all cards minus the cards with set= HERO_SKINS, OR cards with both type = HERO and rarity = FREE, these cards are unwanted for this project
        app.initialFilter(response);

        // take filtered cards as new results array
        app.resultsArr = app.allCards;
        $searchButton.text('Search');
        app.getUserCards();
    });
}

// the initial filtering of ajax response to get rid of a few unwanted cards for this project
app.initialFilter = function(response) {
    app.allCards = response.filter(function(card) {
        if (card.set === "HERO_SKINS" || card.type === "HERO" && card.rarity === "FREE") {
            return
        } else {
            return card;
        }
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
    // get values of selected dropdown items
    app.userName = $('#name').val();
    app.userSet = $('#set').val();
    app.userClass = $('#classes').val();
    app.userRace = $('#race').val();
    app.userType = $('#type').val();
    app.userCost = app.getUserInt($userCost);
    app.userAttack = app.getUserInt($userAttack);
    app.userHealth = app.getUserInt($userHealth);
}    

// if userSelect is a number, parseInt, else keep the "" or "None" value
app.getUserInt = function(selection) {
    const selectVal = $(selection).val();
    return(selectVal !== "" && selectVal !== "None" ? parseInt(selectVal) : selectVal);
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
}

// card match filter method
app.cardMatch = function(userChoice, selection) {
    // filter the results array based on user selection in .getSearchValues in .searchCards
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

// display all cards in resultsArr to page, or disply no cards found message
app.displayCards = function() {
    // start by emptying display area from previous results
    $('.cardFlexContainer').empty();
    app.updateForm();
    app.checkToDisplay();
    
}

// check if cards have been found and display them, else diplay message for no cards found
app.checkToDisplay = function() {
    if (app.resultsArr.length !== 0) {
        // display cards found in results array
        app.displayFoundCards();
    } else {
        // display message if no cards found in results array
        app.noCardsMessage();
    }
}

// display all the found cards to cardFlexContainer - method
app.displayFoundCards = function() {
    // loop through each card found and display it to page
    app.resultsArr.forEach(function(card) {
        // display a card taking the card.id from the api output
        const cardImage = $('<img>').addClass('cardImg').attr('src', `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`).attr('alt', `${card.flavor}`);
        const userCard = $('<li>').addClass('cardBox').append(cardImage).attr({'id':`${card.id}`,'tabindex':0});
        // append each userCard to the display container 
        $('.cardFlexContainer').append(userCard);
    });
}

// display a message if no cards found - method
app.noCardsMessage = function() {
    // no cards found in results array is displayed here
    const noCardsMessage = $('<p>').addClass('noCards').text('No cards found! Please update search.');
    $('.cardFlexContainer').append(noCardsMessage);
}

// update cards found and reset name search - method
app.updateForm = function() {
    // update number of cards found to page
    app.cardsFoundTotal = app.resultsArr.length;
    $cardsFound.text(app.cardsFoundTotal);
    // update name search box
    $('#name').val("");
}

// on click of card in display results, show clicked card in the infoCol
app.chooseACard = function() {
    $('.cardFlexContainer').on('click','li', function() {
        // empty out any previous selected card images
        $('.chosenCard').empty();
        // get the card id of the selected card
        const userCardId = $(this).attr('id');
        // using card id of selected card get the corresponding imag url
        const userCardUrl = `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${userCardId}.png`;
        // find the selected card object in the results array based on its card id
        app.userCard = app.resultsArr.find(function(card){
            return card.id === userCardId;
        });
        app.updateSetName();
        // display details of card and its image (userCardUrl)
        app.displayCardProperties(userCardUrl);
        // slide out the info column if its moved -100% to the right
        app.slideColumn();
    });
}

// update set name from api set name to Hearthstone proper set names (the text in the #set option tags)
app.updateSetName = function() {
    app.setName = []
    // loop across jquery <select> object, find the <option> that has its value === value of single card user selected
    // get that option tag's text and push it into app.setName array, there will only ever be one match to push
    $('#set option').each(function(){
        if ($(this).val() === app.userCard.set) {
            app.setName.push($(this).text());
        }
    });
};

app.displayCardProperties = function(url) {
    // display properties of single selected card
    const cardName = $('#cardName').text(app.userCard.name);
    const cardCost = $('#cardCost').text(app.userCard.cost);
    const cardAttack = $('#cardAttack').text(app.userCard.attack);
    const cardHealth = $('#cardHealth').text(app.userCard.health);
    const type = $('#cardType').text(app.userCard.type);
    const rarity = $('#rarity').text(app.userCard.rarity);
    const xpac = $('#xpac').text(app.setName[0]);
    const artist = $('#artist').text(app.userCard.artist);
    const flavour = $('#flavour').text(app.userCard.flavor);
    
    // display image of single selected card
    const selectedImg = $('<img>').addClass('selectedImg unhide').attr('src', url).attr('alt', app.userCard.flavor);
    
    $('.chosenCard').append(selectedImg);
    $('span').append(flavour, artist, xpac, cardName, type, rarity, cardCost, cardAttack, cardHealth);
}

// slide info column onto page
app.slideColumn = function() {
    if ($infoCol.css('right') === '-1000px') {
        $infoCol.css('right','0px');
    }
}

// hide info column from page
app.hideColumn = function() {
    $infoCol.on('click', function() {
        if($(this).css('right') === '0px') {
            $(this).css('right', '-1000px');
        }
    })
}

// init method
app.init = function() {
    // OUR CODE HERE;
    app.getAllCards();
    app.chooseACard();
    app.hideColumn();
}

// document ready
$(document).ready(function() {
    app.init();
});