//initialize variables
var warArray = [],
    playerAHand = [],
    playerBHand = [];
var playerADeck = '',
    playerBDeck = '',
    playerACard = '',
    playerBCard = '';

var playing = false;

var roundCount = 0,
    playerAPoints = 0,
    playerBPoints = 0;
warCount = 0;

//function to fill an array with 52 numbers
function fillArray() {
    var cards = ["AC", "AD", "AH", "AS", "2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "10C", "10D", "10H", "10S", "JC", "JD", "JH", "JS", "KC", "KD", "KH", "KS", "QC", "QD", "QH", "QS"];
    var deck = [];
    for (var i = 0; i < 52; i++)
        deck[i] = cards[i];

    shuffle(deck);
    splitCards(deck);
}

//function to shuffle deck of cards.
function shuffle(deck) {
    for (var j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
    return deck;
}

//function to split shuffled deck in half
function splitCards(deck) {
    var i = 0;

    //push a card to each "hand" array
    while (i != deck.length) {
        playerAHand.push(deck[i]);
        playerBHand.push(deck[(i + 1)]);
        i += 2;
    }

    $('.playerACount').html("PLAYER A CARDS: " + playerAHand.length);
    $('.playerBCount').html("PLAYER B CARDS: " + playerBHand.length);
    $('.result').html("");
}

//function for auto/pause functionality
var id = null;

function auto() {

    $('.auto').hide();
    $('.pause').show();
    id = setInterval(function() {
        if ((playerAHand.length != 0 && playerBHand.length != 0)) {
            if (roundCount < 100) {
                deal();
            } else {

                $('.auto').hide();
                $('.pause').hide();
                clearInterval(id);
            }

        }

    }, 2000);
}


// function to display rules on button how to play
function rules() {
    $('.rulesButton').click(function() {
        $('.panel').slideDown();
    });

}

// function for pause
function pause() {
    clearInterval(id);
    $('.auto').show();
    $('.pause').hide();
}

//function to take top card off of each deck and put into card slot
function deal() {
    //if a card is already in the slot, removes card. Also shows "New Game" button if hidden
    $('.playerACard').html("");
    $('.playerBCard').html("");
    $('.newGame').show();

    //sets current card for each hand
    playerACard = playerAHand[0];
    playerBCard = playerBHand[0];

    //creates an image element for the current card in each hand
    var img = document.createElement('img');
    var img2 = document.createElement('img');

    img.src = ("img/cards/" + playerAHand[0] + ".png");
    img2.src = ("img/cards/" + playerBHand[0] + ".png");

    //adds card image to the card slot of the game board
    $('.playerACard').append(img).animateCss("flipInX");
    $('.playerBCard').append(img2).animateCss("flipInY");

    //calls compare function to compare current cards
    compare(playerACard, playerBCard);

}

//function to compare both current cards)
function compare(playerA, playerB) {
    var playerANum = playerA.substring(0, playerA.length - 1);
    var playerBNum = playerB.substring(0, playerB.length - 1);
    if (playerANum == "J") {
        playerANum = 11;
    } else if (playerANum == "K") {
        playerANum = 12;
    } else if (playerANum == "Q") {
        playerANum = 13;
    } else if (playerANum == "A") {
        playerANum = 1;
    }
    if (playerBNum == "J") {
        playerBNum = 11;
    } else if (playerBNum == "K") {
        playerBNum = 12;
    } else if (playerBNum == "Q") {
        playerBNum = 13;
    } else if (playerBNum == "A") {
        playerBNum = 1;
    }
    playerANum = parseInt(playerANum);
    playerBNum = parseInt(playerBNum);
    //if player's A card value is higher than the player's B card value, player A wins
    if (playerANum > playerBNum) {

        //updates result div of the game board
        $('.result').html("PLAYER A WINS ☺").animateCss("flipInX");

        //pushes current cards from each hand to the back of the player's A hand
        playerAHand.push(playerB);
        playerAHand.push(playerA);

        //removes current card from the front of each deck
        playerAHand.shift();
        playerBHand.shift();

        setTimeout(function() {
            moveCards('playerA');
        }, 2000);

        //update card counts and check for a winner
        updateCount("playerA", 1);
        checkWin();
    }

    //if player's B card value is higher than the player's A card value, player B wins
    else if (playerANum < playerBNum) {

        //update the results div of the game table
        $('.result').html("PLAYER B WINS ☺").animateCss("flipInX");

        //pushes current cards from each hand to the back of the player's B hand
        playerBHand.push(playerA);
        playerBHand.push(playerB);

        //removes current card from the front of each deck
        playerBHand.shift();
        playerAHand.shift();

        setTimeout(function() {
            moveCards('playerB');
        }, 2000);

        //update card counts and check for a winner
        updateCount("playerB", 1);
        checkWin();
    }

    //if player's A current card value is the same as the player' B current card value a "Tie" occurs
    else if (playerANum == playerBNum)
        tie();
}

//function to move cards to a winners deck
function moveCards(winner) {
    if (winner == "playerAWar") {
        $("#tableArea img").css("position", "relative").animate({
            left: '-2000px'
        }, function() {
            $("#tableArea img").hide();
        });
    } else if (winner == "playerBWar") {
        $("#tableArea img").css("position", "relative").animate({
            left: '2000px'
        }, function() {
            $("#tableArea img").hide();
        });
    }
}

//function to handle "ties"
function tie() {

    //show "tie" animation
    $('#tiePanel').css("display", "table");

    $("#tieText").animateCss("lightSpeedIn", function() {
        $("#tieText").animateCss("lightSpeedOut");
    });

    //keeps animation going for 1 second, then removes the 'tie' class and hides the animation
    setTimeout(function() {
        $('#tiePanel').hide();
        $("#tieText").removeClass("lightSpeedOut");

        $("#tableArea").show();

        //calls function to draw cards from each deck
        warToArray();
    }, 2000);

}

//function to take cards from each deck and put into "tie" array
function warToArray() {

    var cardStr = "";
    var length = 0;
    warCount++;


    //take the cards from each deck and push them to the tie array
    warArray.push(playerAHand[0]);
    playerAHand.shift();
    warArray.push(playerBHand[0]);
    playerBHand.shift();
    cardStr += '<img src="img/backcard.jpg">';


    //set up the Tie panel with relevant cards
    $(".playerAfinal").html("<img src='img/cards/" + playerAHand[0] + ".png'>").animateCss("flipInY");
    $(".playerAcards").html(cardStr);
    $(".playerBcards").html(cardStr);
    $(".playerBfinal").html("<img src='img/cards/" + playerBHand[0] + ".png'>").animateCss("flipInX");

    //compare the new current card from each deck
    compareWar(playerAHand[0], playerBHand[0]);
}


//function to compare current cards and allocate the tie array correctly
function compareWar(playerA, playerB) {
    var playerANum = playerA.substring(0, playerA.length - 1);
    var playerBNum = playerB.substring(0, playerB.length - 1);
    if (playerANum == "J") {
        playerANum = 11;
    } else if (playerANum == "K") {
        playerANum = 12;
    } else if (playerANum == "Q") {
        playerANum = 13;
    } else if (playerANum == "A") {
        playerANum = 1;
    }
    if (playerBNum == "J") {
        playerBNum = 11;
    } else if (playerBNum == "K") {
        playerBNum = 12;
    } else if (playerBNum == "Q") {
        playerBNum = 13;
    } else if (playerBNum == "A") {
        playerBNum = 1;
    }
    playerANum = parseInt(playerANum);
    playerBNum = parseInt(playerBNum);


    //if player's A Tie card value is greater than the player's B War card value, player A wins the tie
    if (playerANum > playerBNum) {

        //updates result section of the game table
        $('.result').html("PLAYER A WINS ☺");

        //pushes entire war array to the back of the player's A hand
        playerAHand.push.apply(playerAHand, warArray);

        //pushes both current cards (Tie cards) to back of the player's A hand
        playerAHand.push(playerB);
        playerAHand.push(playerA);

        //removes current card from both hands
        playerAHand.shift();
        playerBHand.shift();

        //resets the tie array to empty
        warArray.length = 0;

        setTimeout(function() {
            moveCards("playerAWar");
            moveCards("playerA");
        }, 2500);

        setTimeout(function() {
            $("#tableArea").hide();
        }, 3500);

        //update card count and check for a winner
        updateCount("playerA", warCount);
        warCount = 0;
        checkWin();
    }

    //if player's B tie card value is greater than the player's A tie card value, player B wins the tie
    else if (playerANum < playerBNum) {

        //update result section of the game table
        $('.result').html("PLAYER B WINS ☺");

        //pushes the entire tie array to the back of the player's B hand
        playerBHand.push.apply(playerBHand, warArray);

        //pushes both current cards (Tie cards) to the back of the Player B hand
        playerBHand.push(playerA);
        playerBHand.push(playerB);

        //removes the current cards from each hand
        playerAHand.shift();
        playerBHand.shift();

        //resets the tie array to empty
        warArray.length = 0;

        setTimeout(function() {
            moveCards("playerBWar");
            moveCards("playerB");
        }, 2500);

        setTimeout(function() {
            $("#tableArea").hide();
        }, 3000);

        //update card count and check for a winner
        updateCount("playerB", warCount);
        warCount = 0;
        checkWin();
    }

    //if player's A tie card value is the same as the player's B tie card value, call for another tie
    else if (playerANum == playerBNum)
        tie();
}


//function to check if either player A is out of cards (being a win for the other player)
function checkWin() {

    //if player A is out of cards, player B wins
    if (playerAHand.length == 0) {
        $(".result").html("Player B Wins as Player A is out of Cards ☺").animateCss("flipInX");

        //resets the card and deck image to make it seem like the player is out of cards
        $('.playerACard').html("");
        $('.playerADeck').html("");

        //hides the "deal" button, forces player to only start a new game
        $('.deal').hide();
        $('.auto').hide();
    }

    //if player B is out of cards, player A wins
    else if (playerBHand.length == 0) {

        $(".result").html("Player A Wins as Player B is out of Cards ☺").animateCss("flipInX");

        //resets the card and deck image to make it seem like the Player B is out of cards.
        $('.playerBCard').html("");
        $('.playerBDeck').html("");

        //hides the "deal" button, forces the player A to only start a new game
        $('.deal').hide();
        $('.auto').hide();
    }

    if (roundCount == 100) {
        $('.deal').hide();
        $('.auto').hide();
        if (playerAPoints > playerBPoints) {

            $('.result').html("Player A won the Game with " + playerAPoints + " Points in total 100 Rounds with " + playerAHand.length + " cards left");

        } else if (playerAPoints < playerBPoints) {
            $('.result').html("Player B won the Game with " + playerBPoints + " Points in total 100 Rounds with " + playerBHand.length + " cards left");
        } else {
            $('#tieText').html("PLAY CHESS!......");
            $('.chess').show();
            $('#tiePanel').css("display", "table");
            $("#tieText").animateCss("lightSpeedIn", function() {
                $("#tieText").animateCss("lightSpeedOut");
            });
        }

    }
}

//function that hides the "how to play" screen and shows the game table
function play() {
    hideAll();
    $("#header").show().addClass("animated fadeInDown");
    $("#gameTable").show();
    $('.pause').hide();
    $('.chess').hide();
    $('.playerAPoints').html("Points Scored: " + playerAPoints);
    $('.playerBPoints').html("Points Scored: " + playerBPoints);
    playing = true;
}

//function to update the card count after every "deal" finishes
function updateCount(winner, count) {
    if (winner == 'playerA') {
        playerAPoints = playerAPoints + count;
        $('.playerAPoints').html("Points Scored: " + playerAPoints);
    } else {
        playerBPoints = playerBPoints + count;
        $('.playerBPoints').html("Points Scored: " + playerBPoints);
    }
    roundCount = roundCount + count;
    $('#roundCount').html(roundCount);

    $('.playerACount').html("Player A cards: " + playerAHand.length);
    $('.playerBCount').html("Player B cards: " + playerBHand.length);
}

//simple function to hide big page elements, usually followed by showing other specific elements
function hideAll() {
    $("#jumbotron").hide();
    $("#gameTable").hide();
    $("#howToPlay").hide();
    $("#header").hide();
    $(".newGame").hide();
}

window.onload = function() {

    preloadImages();

    hideAll();
    $("#jumbotron").show();
    $("#howToPlay").show();
    fillArray();
};

$.fn.extend({
    animateCss: function(animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});

//function to preload images into the browser cache for quicker loading during play
function preloadImages() {
    var cardTypes = ["C", "D", "H", "S"];
    for (var j = 0; j < cardTypes.length; j++) {
        for (var i = 1; i <= 13; i++) {
            var img = new Image();
            if (i <= 10) {
                if (i == 1)
                    img.src = 'img/cards/' + "A" + cardTypes[j] + '.png';
                else
                    img.src = 'img/cards/' + i + cardTypes[j] + '.png';
            } else {
                if (i == 11)
                    img.src = 'img/cards/' + "J" + cardTypes[j] + '.png';
                if (i == 12)
                    img.src = 'img/cards/' + "K" + cardTypes[j] + '.png';
                if (i == 13)
                    img.src = 'img/cards/' + "Q" + cardTypes[j] + '.png';
            }
        }
    }
}
