let PlayerIds;
let PlayerTeammates;

let StartPlayer;
let EndPlayer;
let PrevPlayer;

let Guesses = [];
let LatestGuessField = null;

let MAXGUESSES = 6;

function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

function getPsrand(){
    let today = new Date().toLocaleDateString();
    seed = cyrb128(today); 
    return sfc32(seed[0], seed[1], seed[2], seed[3]);
}

var randomChoice = function(arr, rfunc) {
    return arr[Math.floor(arr.length * rfunc())];
}

function setTodayPlayers(){
    let popular_players = [2214, 3045, 10193, 5952, 11201, 2532, 4088, 8456, 71, 10357, 8713, 6269, 7567, 11353, 8115, 2801, 5644, 10564, 6304, 5609, 10016, 8059, 6056, 2512, 2512, 1923, 3117, 6437, 11173, 344, 6261, 333, 7944, 703, 6095, 55, 9637, 7227, 10343, 2485, 6957, 6386, 2476, 9834, 3994, 118, 9422, 2522, 3, 6940, 1683, 7871, 4660, 1081, 8347, 4495, 7033, 7791, 10012, 8123, 4965, 8228, 4490, 3311, 5237, 4408, 2958, 7681, 1531, 11152, 11591, 2252, 7926, 3420, 5081, 10481, 1535, 3089, 11165, 5507, 1867, 6971, 2353, 10229, 2353, 6971, 312, 4907, 6612, 3978, 8044, 3353, 3217, 9737, 6201, 1083, 4275, 3976, 7991, 10846, 3778, 8543, 11578, 7722, 6848, 2553, 11, 4116, 8240, 9415, 25, 3780, 705, 9555, 6651, 6578, 7830, 9820, 2268, 2758, 2069, 8435, 4636, 7193, 2444, 2964, 11428, 6178, 8972, 7460, 9348, 1813, 8996, 1397, 9068, 1495, 759, 10143, 6342, 309, 4850, 2773, 2157, 7916, 586, 11031, 11270, 2433, 4140, 1995, 11001, 5514, 9171, 8817, 781, 9092, 1239, 10735, 5739, 2609, 3122, 6998, 9016, 11075, 10295, 3710, 6914, 8010, 8057, 7103, 9325, 425];
    rand = getPsrand(); // get today's random gen function
    StartPlayer = randomChoice(popular_players, rand);
    console.log("Start Player: " + StartPlayer);

    EndPlayer = randomChoice(popular_players, rand);

    while (EndPlayer === StartPlayer || PlayerTeammates[StartPlayer].includes(EndPlayer)){
        EndPlayer = randomChoice(popular_players, rand);
    }
    console.log("End Player: " + EndPlayer);

}

async function loadPlayerId() {
    const response = await fetch("./player_lookup_table.json");
    const playerIds = await response.json();

    PlayerIds = playerIds;
    console.log("loaded player ids")
}

async function loadPlayerTeammates() {
    const response = await fetch("./player_teammates.json");
    const playerTeammates = await response.json();

    PlayerTeammates = playerTeammates;
    console.log("loaded player teammates")
}


function addGuess(id, acc, num) {
    let inner_div = document.createElement("div");
    inner_div.id = "guess-" + num;
    inner_div.classList.add('cell')

    if (acc == true) {
        inner_div.classList.add('correct')
    } else {
        inner_div.classList.add('wrong')
    }

    inner_div.innerHTML = PlayerIds[id]

    document.getElementById('guess-pt').appendChild(inner_div)
}


function getRemainingGuesses(){
    return MAXGUESSES - Guesses.length;
}
function updateGuessCnt(){
    document.getElementById("remaining-guess-cnt").innerHTML = getRemainingGuesses();
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function get_share_text() {
    share_str = "";
    for (var i in Guesses){
        if (Guesses[i][1] === false){
            share_str += '🟥';
        } else {
            share_str += '🟩';
        }
    }

    share_str += '🏈';

    return share_str;
}
async function init() {
    window.localStorage.clear();
    await loadPlayerId();
    await loadPlayerTeammates();

    var player_names = []
    for (var key in PlayerIds) {
        player_names.push(PlayerIds[key]);
    }

    setTodayPlayers();
    PrevPlayer = StartPlayer;

    document.getElementById("p-start").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("p-end").innerHTML = PlayerIds[EndPlayer];
    document.getElementById("ui").innerHTML = "";

    document.getElementById("start-player").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("end-player").innerHTML = PlayerIds[EndPlayer];

    for (let x = 0; x < Guesses.length; x++) {
        addGuess(Guesses[x][0], Guesses[x][1], x)
    }
    updateGuessCnt();

    //initialized
    document.getElementById("loading-screen").style.display = "none";
    autocomplete(document.getElementById("ui"), player_names);
}

function game_end() {
    document.getElementById("next-pt").style.setProperty("display", "none", "important");
}

function autocomplete(inp, arr) {
    // W3Schools autocomplete
    var currentFocus;
    inp.addEventListener("input", function(e) {

        var a, b, i;
        var val = inp.innerHTML;
        closeAllLists();

        if (!val) {
            return false;
        }
        currentFocus = -1;


        // create auto complete list 
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        // add list to autocomplete wrapper
        document.getElementById("autocomplete-wrapper").appendChild(a);

        // populate auto complete
        var result_count = 0;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                result_count++; 
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + getKeyByValue(PlayerIds, arr[i]) + "'>";
                b.addEventListener("click", function(e) { // add onclick event listener for each div
                    console.log("Event triggered")
                    /*insert the value for the autocomplete text field:*/
                    var input_id = parseInt(this.getElementsByTagName("input")[0].value)
                    inp.innerHTML = PlayerIds[input_id];
                    closeAllLists();

                    // check if player is correct            
	                if (PlayerTeammates[PrevPlayer].includes(input_id)) {
	                    Guesses.push([input_id, true])
	                    PrevPlayer = parseInt(input_id);
	                    addGuess(input_id, true, Guesses.length - 1)
    	                if (PlayerTeammates[PrevPlayer].includes(EndPlayer)) { //if player won remove next field box
                            game_end();
    	                }

	                } else {
	                    Guesses.push([input_id, false])
	                    addGuess(input_id, false, Guesses.length - 1)
	                }

                    updateGuessCnt();
	                inp.innerHTML = "";

                    if (getRemainingGuesses() <= 0){
                        game_end();
                    }
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}




init();
console.log("loaded");