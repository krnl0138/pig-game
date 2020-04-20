var scores, roundScore, activePlayer, gamePlaying, winPoints;
var names, multiplicator, multiDice, multiCounter;
var winners, winPointsForm, lastDice;

names=[];
winners = [0, 0];

if(window.attachEvent) {
window.attachEvent('onload', init);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            yourFunctionName(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = init;
    }
}


function inputEvil() {
        var inputEvilDice = document.getElementById('evilDice').value;
        if (inputEvilDice) {
            evilDice = inputEvilDice;
        } else {
            evilDice = 0;
        }
}

function inputMulti() {
        var inputMultiDice = document.getElementById('multiDice').value;
        if (inputMultiDice) {
            multiDice = inputMultiDice;
        } else {
            multiDice = 6;
        }
}

function inputDices() {
        document.querySelector('.btn-roll').addEventListener('click', roll1Dices);
}


function init() {

    inputDices();
    inputMulti();
    inputEvil();

    // Zero everything on the screen
    zeroAll();

    // Game options
    gamePlaying = true;
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    multix2 = 2;
    multix3 = 3;
    multiCounter = 0;

    function namesApply() {
        // Store players names &
        // Add bagde counter for winners in current session
        document.getElementById('name-0').innerHTML = names[0] + ' (' + winners[0] + ')';
        document.getElementById('name-1').innerHTML = names[1] + ' (' + winners[1] + ')';
    }
    function namesPrompt() {
        winners = [0, 0];
        names[0] = prompt('Enter the name for the first player');
        names[1] = prompt('Enter the name for the second player');
    }

    // add names
    // If there are names ==> confirm dialog: remain or create
    if (names[0] || names[1]) {
        if (confirm("Save the same players?")) {
            namesApply();
        } else {
            namesPrompt();
            namesApply();
        }
    } else {
        namesPrompt();
        namesApply();
    }
}

// INFO:
function infoScore(num,num2) {document.getElementById('score-'+num).textContent = num2;}
// INFO:
function infoCurrentScore(num,num2) {document.getElementById('current-' + num).textContent = num2;}
// INFO:
function infoActivePanelToggle(num) {document.querySelector('.player-' + num + '-panel').classList.toggle('active');}
// INFO:
function infoNames(num) {document.getElementById('name-' + num).innerHTML = names[num] + ' (' + winners[num] + ')';}

function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0; // TERNARY OPERATOR FORM
    roundScore = 0;
    multiCounter = 0;

    infoCurrentScore(0,0);
    infoCurrentScore(1,0);

    infoActivePanelToggle(0);
    infoActivePanelToggle(1);

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice-second').style.display = 'none';
}

function zeroAll() {
    multiCounter = 0;

    // Zeroing all the scores at the beggining
    infoScore(0,0);
    infoScore(1,0);
    infoCurrentScore(0,0);
    infoCurrentScore(1,0);

    // No dice in the beggining
    document.querySelector('.dice').classList.add('hidden');

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');

    document.querySelector('.settings-panel').classList.add('hidden');
    document.querySelector('.btn-back').classList.add('hidden');
}

function toggleHidden() {
    document.querySelector('.settings-panel').classList.toggle('hidden');
    document.querySelector('.player-0-panel').classList.toggle('hidden');
    document.querySelector('.player-1-panel').classList.toggle('hidden');
    document.querySelector('.btn-new').classList.toggle('hidden');
    document.querySelector('.btn-hold').classList.toggle('hidden');
    document.querySelector('.btn-roll').classList.toggle('hidden');
    document.querySelector('.btn-settings').classList.toggle('hidden');
    document.querySelector('.btn-back').classList.toggle('hidden');
    document.querySelector('.dice').style.display = 'none';
}


// BUTTONS `SETTINGS` & `GO-BACK`
document.querySelector('.btn-settings').addEventListener('click', toggleHidden);
document.querySelector('.btn-back').addEventListener('click', toggleHidden);

// BUTTON `NEW GAME` FUNCTIONALITY
document.querySelector('.btn-new').addEventListener('click', init);



function roll1Dices() {
    // Do action only if game is playing
    if (gamePlaying) {

    inputDices();
    inputMulti();
    inputEvil();

        console.log('Multidice is: ' + multiDice);
        console.log('Multicounter is: ' + multiCounter);

        // 1. Random number.
        var dice = Math.floor(Math.random() * 6) + 1; // random every time it is declared

        // 2. Display the result.
        var diceDOM = document.querySelector('.dice'); // not perform querySelect every time
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';

        // 3. Update the round score IF the rolled number was NOT a 1.
        if (dice !== 1) { // no type coehrecion

            // Add multiplicators
            // If some dice is rolling three times in a row then * multiplicator
            if (dice == multiDice) {
                multiCounter++;

                if (multiCounter == 2) {
                    roundScore *= multix2;
                } else if (multiCounter > 2) {
                    roundScore *= multix3;
                } else { roundScore += dice; }

            } else if (dice == evilDice && lastDice == evilDice) {
                scores[activePlayer] = 0;
                roundScore[activePlayer] = 0;
                document.getElementById('score-' + activePlayer).textContent = 0;
                nextPlayer();
            } else {
                roundScore += dice;
            }

            document.querySelector('#current-' + activePlayer).textContent = roundScore; // selection is the same as in CSS
        } else {
            // Other player turn
            lastDice = 0;
            nextPlayer();
        }

        lastDice = dice;
    }
}


document.querySelector('.btn-hold').addEventListener('click', hold);
function hold() {
    // Do action only if game is playing
    if (gamePlaying) {

        inputMulti();
        inputEvil();

        lastDice = 0;

        var inputWinPoints = document.getElementById('winPoints').value;
        if (inputWinPoints) {winPoints = inputWinPoints;} else {winPoints=100;}

        // 1. Add current score to global score
        scores[activePlayer] += roundScore;

        // 2. Update UI
        var playerScoreDOM = document.getElementById('score-' + activePlayer);
        playerScoreDOM.textContent = scores[activePlayer];

        // 3. Check if player win the game
        if (scores[activePlayer] >= winPoints) {
            document.querySelector('.dice').style.display = 'none';
            document.getElementById('name-' + activePlayer).textContent = 'Winner';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
            // Log who won last game
            winners[activePlayer] += 1;
        } else {
            // Change the active player only when not winning a game
            nextPlayer();
        }
    }
}
