let PlayerIds;
let PlayerTeammates;

let StartPlayer;
let EndPlayer;
let PrevPlayer;

let LatestGuessField = null;

let MAXGUESSES = 6;
let popular_players = [10586, 3011, 10081, 5882, 11075, 2503, 4044, 8357, 71, 10244, 8611, 6194, 7480, 11222, 8019, 2769, 5578, 10447, 6229, 5543, 9906, 7963, 5983, 2484, 2484, 1900, 3082, 6360, 11048, 341, 6186, 330, 7850, 696, 6022, 55, 9531, 7143, 10230, 2458, 6876, 6311, 2449, 9725, 3952, 116, 9318, 2493, 3, 6859, 1662, 7780, 4605, 1070, 8249, 4446, 6949, 7701, 9902, 8027, 4908, 8132, 4441, 3274, 5176, 4359, 2925, 7592, 1513, 11028, 11459, 2226, 7833, 3381, 5023, 10364, 1516, 3054, 11041, 5443, 1844, 6889, 2327, 10116, 2327, 6889, 309, 4850, 6534, 3936, 7948, 3314, 3181, 9629, 6126, 1072, 4231, 3934, 7897, 10726, 3738, 8442, 11446, 7633, 6768, 2523, 11, 4072, 8144, 9311, 25, 3740, 698, 9449, 6572, 6501, 7739, 9711, 2242, 2726, 2045, 8337, 4581, 7109, 2417, 2930, 11297, 6104, 8869, 7373, 9244, 1791, 8893, 1381, 8965, 752, 10032, 6267, 306, 4793, 2741, 2133, 7824, 581, 10908, 11142, 2406, 4096, 1971, 10878, 5450, 8715, 8989, 1224, 10616, 5672, 3086, 6914, 8913, 10951, 10182, 3671, 6833, 7019, 9221, 421, 2189, 1522, 2910, 10729, 6186];


let Statistics = {"gamesPlayed": 0, "gamesWon": 0, "gameStats": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "fail": 0}, "currentStreak": 0, "maxStreak": 0};
let CurrentGame = {"id" : btoa(getDate()), "guesses": [], "finished": false, "won": false}

let DONOTTOUCHTHIS = "";

function getDate() {
    //return (Math.random() + 1).toString(36).substring(7); //ONLY USE FOR TESTING
    return new Date().toLocaleDateString();
}

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
    let today;
    today = getDate();
    
    seed = cyrb128(today); 
    return sfc32(seed[0], seed[1], seed[2], seed[3]);
}

var randomChoice = function(arr, rfunc) {
    return arr[Math.floor(arr.length * rfunc())];
}

function setTodayPlayers(){
    rand = getPsrand(); // get today's random gen function
    StartPlayer = randomChoice(popular_players, rand);
    console.log("Start Player: " + StartPlayer);

    EndPlayer = randomChoice(popular_players, rand);

    while (EndPlayer === StartPlayer || PlayerTeammates[StartPlayer].includes(EndPlayer)){
        EndPlayer = randomChoice(popular_players, rand);
    }
    console.log("End Player: " + EndPlayer);

    PrevPlayer = StartPlayer;
}

async function loadPlayerId() {
    const response = await fetch("./player_lookup_table.json");
    PlayerIds = await response.json();
    console.log("loaded player ids")
}

async function loadPlayerTeammates() {
    const response = await fetch("./player_teammates.json");
    PlayerTeammates = await response.json();
    console.log("loaded player teammates")
}


function renderGuess(id, acc, num){
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

function addGuess(id, acc, num) {
    if (acc == true) {
        CurrentGame["guesses"].push([id, true]);
        renderGuess(id, acc, num);
    } else {
        CurrentGame["guesses"].push([id, false]);
        renderGuess(id, acc, num);
    }
    syncLocalStorage();
}


function getRemainingGuesses(){
    return MAXGUESSES - CurrentGame["guesses"].length;
}
function updateGuessCnt(){
    document.getElementById("remaining-guess-cnt").innerHTML = getRemainingGuesses();
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function generate_share_text() {
    share_str = "Touchdown\n";
    share_str += PlayerIds[StartPlayer] + " → " + PlayerIds[EndPlayer] + "\n🏈";
    for (var i in CurrentGame["guesses"]){
        if (CurrentGame["guesses"][i][1] === false){
            share_str += '🟥';
        } else {
            share_str += '🟩';
        }
    }
    for (i = 0; i < 6 - CurrentGame["guesses"].length; i++){
        share_str += '⬜';
    }
    share_str += "\nhttps://touchdown.life";
    return share_str;
}

function share(){
    text = generate_share_text();
    navigator.clipboard.writeText(text);
}


function update_stats_modal() {
    document.getElementById('games-played').innerHTML = Statistics['gamesPlayed'];

    if (Statistics['gamesPlayed'] === 0){
        document.getElementById('win-percentage').innerHTML = "0%"
    } else {
        document.getElementById('win-percentage').innerHTML = Math.round(Statistics['gamesWon']/Statistics['gamesPlayed'] * 100) + "%";
    }
    document.getElementById('current-streak').innerHTML = Statistics['currentStreak'];
    document.getElementById('max-streak').innerHTML = Statistics['maxStreak'];

    var maxval = Math.max(...Object.values(Statistics["gameStats"]));
    if (maxval === 0){
        for (var i = 1; i <= 6; i++){
            document.getElementById('stats-r-' + i).innerHTML = Statistics["gameStats"][i];
            var s_w_calc = 8;
            document.getElementById('stats-r-' + i).style.width = s_w_calc + "%";
        }
    } else {
        for (var i = 1; i <= 6; i++){
            document.getElementById('stats-r-' + i).innerHTML = Statistics["gameStats"][i];
            var s_w_calc = (92 * Statistics["gameStats"][i]/maxval) + 8;
            document.getElementById('stats-r-' + i).style.width = s_w_calc + "%";
        }
    }

    if (CurrentGame["finished"] && CurrentGame["won"]) {
        document.getElementById('stats-r-' + CurrentGame["guesses"].length).classList.add("current");
    }
}

function bfs_pop(pop_list){
    var explored = [];
    var queue = [[StartPlayer]];
    if (StartPlayer === EndPlayer){
        return [start];
    }
    while (queue) {
        var path = queue.shift();
        var node = path[path.length - 1];

        if (!explored.includes(node)){
            var adjs = PlayerTeammates[node];
            for (adj_id in adjs) {
                var adj = adjs[adj_id];
                if (pop_list.includes(adj)){
                    var new_path = [...path];
                    new_path.push(adj);
                    queue.push(new_path);

                    if (adj === EndPlayer) {
                        return new_path
                    }
                }
            }
            explored.push(node);
        }
    }
    return null; 
}

function bfs(){
    var explored = [];
    var queue = [[StartPlayer]];
    if (StartPlayer === EndPlayer){
        return [start];
    }
    while (queue) {
        var path = queue.shift();
        var node = path[path.length - 1];

        if (!explored.includes(node)){
            var adjs = PlayerTeammates[node];
            for (adj_id in adjs) {
                var adj = adjs[adj_id];
                var new_path = [...path];
                new_path.push(adj);
                queue.push(new_path);
                if (adj === EndPlayer) {
                    return new_path
                }
            }
            explored.push(node);
        }
    }
    return null;
}


function syncLocalStorage(){
    localStorage.setItem("CurrentGame", JSON.stringify(CurrentGame));
    localStorage.setItem("Statistics", JSON.stringify(Statistics));
}

function winStatic(){
    document.getElementById("next-pt").style.setProperty("display", "none", "important");
    document.getElementsByClassName("stats-modal-share")[0].style.setProperty("display", "block");
    document.getElementsByClassName("stats-modal-shortest-path")[0].style.setProperty("display", "block");
    document.getElementById("path-phrase").innerHTML = "Alternate";

    var pos_path;
    pos_path = bfs_pop(popular_players);
   
    if (pos_path === null){
        pos_path = bfs();
    }

    var path_string = "<span>" + PlayerIds[StartPlayer] + " → ";
    for (i = 1; i < pos_path.length - 1; i++){
        path_string += "<span class=\"correct\">" + PlayerIds[pos_path[i]] + "</span> → ";
    }
    path_string += PlayerIds[EndPlayer] + "</span>";   

    document.getElementById("p-route").innerHTML = path_string;
}

function loseStatic(){
    document.getElementById("next-pt").style.setProperty("display", "none", "important");
    document.getElementsByClassName("stats-modal-share")[0].style.setProperty("display", "block");
    document.getElementsByClassName("stats-modal-shortest-path")[0].style.setProperty("display", "block");
    document.getElementById("path-phrase").innerHTML = "Possible";


    var pos_path;
    pos_path = bfs_pop(popular_players);
   
    if (pos_path === null){
        pos_path = bfs();
    }

    var path_string = "<span>" + PlayerIds[StartPlayer] + " → ";
    for (i = 1; i < pos_path.length - 1; i++){
        path_string += "<span class=\"correct\">" + PlayerIds[pos_path[i]] + "</span> → ";
    }
    path_string += PlayerIds[EndPlayer] + "</span>"; 

    document.getElementById("p-route").innerHTML = path_string;
}

async function init() {
    await loadPlayerId();
    await loadPlayerTeammates();

    var player_names = []
    for (var key in PlayerIds) {
        player_names.push(PlayerIds[key]);
    }

    setTodayPlayers();
    if (localStorage.getItem("CurrentGame") !== null && CurrentGame["id"] === btoa(getDate())){
        CurrentGame = JSON.parse(localStorage.getItem("CurrentGame"));  
        document.getElementById("info-modal").style.display = "none";
    }

    if (localStorage.getItem("Statistics") !== null){
        Statistics = JSON.parse(localStorage.getItem("Statistics"));
        document.getElementById("info-modal").style.display = "none";
    }
    syncLocalStorage();

    document.getElementById("p-start").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("p-end").innerHTML = PlayerIds[EndPlayer];
    document.getElementById("ui").innerHTML = "";

    document.getElementById("start-player").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("end-player").innerHTML = PlayerIds[EndPlayer];

    for (let x = 0; x < CurrentGame["guesses"].length; x++) {
        renderGuess(CurrentGame["guesses"][x][0], CurrentGame["guesses"][x][1], x)
    }
    updateGuessCnt();


    if (CurrentGame["finished"]){
        if (CurrentGame["won"]){ //MAKE SURE TO UPDATE WIN CODE HERE AS WELL
            winStatic();
        } 
        if (!CurrentGame["won"]){
            loseStatic();
        }
    }

    //initialized
    document.getElementById("loading-screen").style.display = "none";
    autocomplete(document.getElementById("ui"), player_names);
}

function game_end(won) {
    CurrentGame["finished"] = true;
    CurrentGame["won"] = won;

    Statistics["gamesPlayed"]++;
    if (won){
        winStatic();
        Statistics["currentStreak"]++;
        Statistics["gamesWon"]++;
        if (Statistics["currentStreak"] > Statistics["maxStreak"]){
            Statistics["maxStreak"] = Statistics["currentStreak"];
        } 
        Statistics["gameStats"][CurrentGame["guesses"].length]++;
    } else {
        loseStatic();
        Statistics["currentStreak"] = 0;
        Statistics["gameStats"]["fail"]++;
    }

    syncLocalStorage();
    setTimeout(function(){
        stats_modal.style.display = "flex";
        update_stats_modal();
    }, 1300);
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
	                    PrevPlayer = parseInt(input_id);
	                    addGuess(input_id, true, CurrentGame["guesses"].length - 1)
    	                if (PlayerTeammates[PrevPlayer].includes(EndPlayer)) { //if player won remove next field box
                            game_end(true);
    	                }

	                } else {
	                    addGuess(input_id, false, CurrentGame["guesses"].length - 1)
	                }

                    updateGuessCnt();
	                inp.innerHTML = "";

                    if (getRemainingGuesses() <= 0){
                        game_end(false);
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