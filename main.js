let PlayerIds;
let PlayerTeammates;
let PlayerDefaultDates;

let StartPlayer;
let EndPlayer;
let PrevPlayer;

let LatestGuessField = null;

let MAXGUESSES = 6;
let popular_players = [
    10923, 3114, 10405, 6082, 11427, 2594, 4185, 8633, 73, 10573, 8901, 6412,
    7731, 11580, 8281, 2868, 5771, 10781, 6448, 5736, 10225, 8223, 6191, 2573,
    2573, 1966, 3188, 6587, 11397, 351, 6404, 339, 8109, 719, 6232, 57, 9841,
    7382, 10559, 2543, 7113, 6533, 2534, 10039, 4091, 118, 9624, 2582, 3, 7096,
    1723, 8037, 4763, 1102, 8518, 4594, 7188, 7956, 10221, 8289, 5085, 8395,
    4588, 3386, 5364, 4504, 3025, 7844, 1564, 11376, 11833, 2308, 8092, 3500,
    5206, 10697, 1567, 3159, 11389, 5632, 1910, 7126, 2410, 10440, 2410, 7126,
    318, 5026, 6765, 4075, 8208, 3430, 3290, 9941, 6342, 1104, 4375, 4072, 8156,
    11063, 3870, 8722, 11817, 7886, 7003, 2614, 11, 4213, 8407, 9617, 26, 3872,
    721, 9755, 6804, 6732, 7994, 10025, 2324, 2821, 2116, 8609, 4738, 7348,
    2501, 3030, 11657, 6317, 9167, 7623, 9549, 1857, 9192, 1423, 9266, 777,
    10354, 6487, 315, 4969, 2839, 2209, 8082, 602, 11251, 11497, 2490, 4238,
    2037, 11220, 5639, 9007, 9290, 1262, 10953, 5867, 3192, 7153, 9212, 11295,
    10508, 3798, 7069, 7258, 9526, 435, 2269, 1574, 3010, 11066, 6404,
];

let Statistics = {
    gamesPlayed: 0,
    gamesWon: 0,
    gameStats: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    currentStreak: 0,
    maxStreak: 0,
};
let CurrentGame = {
    id: btoa(getDate()),
    guesses: [],
    finished: false,
    won: false,
};

let DONOTTOUCHTHIS = "";

function getDate() {
    return new Date().toLocaleDateString();
}

function cyrb128(str) {
    let h1 = 1779033703,
        h2 = 3144134277,
        h3 = 1013904242,
        h4 = 2773480762;
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
    return [
        (h1 ^ h2 ^ h3 ^ h4) >>> 0,
        (h2 ^ h1) >>> 0,
        (h3 ^ h1) >>> 0,
        (h4 ^ h1) >>> 0,
    ];
}

function sfc32(a, b, c, d) {
    return function () {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}

function daysPassed() {
    var date1 = new Date("9/17/2022");
    var today = new Date(getDate());

    return parseInt((today.getTime() - date1.getTime()) / (1000 * 3600 * 24));
}

function getPsrand() {
    let today;
    today = getDate();

    seed = cyrb128(today);
    return sfc32(seed[0], seed[1], seed[2], seed[3]);
}

var randomChoice = function (arr, rfunc) {
    return arr[Math.floor(arr.length * rfunc())];
};

function setTodayPlayers() {
    let today = getDate();
    if (PlayerDefaultDates.hasOwnProperty(today)) {
        // assume inputted players will be valid
        [StartPlayer, EndPlayer] = PlayerDefaultDates[today];
    } else {
        rand = getPsrand(); // get today's random gen function
        StartPlayer = randomChoice(popular_players, rand);
        EndPlayer = randomChoice(popular_players, rand);

        while (
            EndPlayer === StartPlayer ||
            PlayerTeammates[StartPlayer].includes(EndPlayer)
        ) {
            EndPlayer = randomChoice(popular_players, rand);
        }
    }
    console.log("Start Player: " + StartPlayer);
    console.log("End Player: " + EndPlayer);

    PrevPlayer = StartPlayer;
}

async function loadPlayerId() {
    const response = await fetch("./player_lookup_table.json");
    PlayerIds = await response.json();
    console.log("loaded player ids");
}

async function loadPlayerTeammates() {
    const response = await fetch("./player_teammates.json");
    PlayerTeammates = await response.json();
    console.log("loaded player teammates");
}

async function loadPlayerDefaultDates() {
    const response = await fetch("./player_default_dates.json");
    PlayerDefaultDates = await response.json();
    console.log("loaded player default dates");
}

function renderGuess(id, acc, num) {
    let inner_div = document.createElement("div");
    inner_div.id = "guess-" + num;
    inner_div.classList.add("cell");

    if (acc == true) {
        inner_div.classList.add("correct");
    } else {
        inner_div.classList.add("wrong");
    }

    inner_div.innerHTML = PlayerIds[id];

    document.getElementById("guess-pt").appendChild(inner_div);
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

function getRemainingGuesses() {
    return MAXGUESSES - CurrentGame["guesses"].length;
}
function updateGuessCnt() {
    document.getElementById("remaining-guess-cnt").innerHTML =
        getRemainingGuesses();
}

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

function generate_share_text() {
    share_str = "Touchdown #" + daysPassed() + "\n";
    share_str += PlayerIds[StartPlayer] + " → " + PlayerIds[EndPlayer] + "\n🏈";
    for (var i in CurrentGame["guesses"]) {
        if (CurrentGame["guesses"][i][1] === false) {
            share_str += "🟥";
        } else {
            share_str += "🟩";
        }
    }
    for (i = 0; i < 6 - CurrentGame["guesses"].length; i++) {
        share_str += "⬜";
    }
    share_str += "\nhttps://touchdown.life";
    return share_str;
}

function share() {
    text = generate_share_text();
    navigator.clipboard.writeText(text);
}

function update_stats_modal() {
    document.getElementById("games-played").innerHTML =
        Statistics["gamesPlayed"];

    if (Statistics["gamesPlayed"] === 0) {
        document.getElementById("win-percentage").innerHTML = "0%";
    } else {
        document.getElementById("win-percentage").innerHTML =
            Math.round(
                (Statistics["gamesWon"] / Statistics["gamesPlayed"]) * 100
            ) + "%";
    }
    document.getElementById("current-streak").innerHTML =
        Statistics["currentStreak"];
    document.getElementById("max-streak").innerHTML = Statistics["maxStreak"];

    var maxval = Math.max(...Object.values(Statistics["gameStats"]));
    if (maxval === 0) {
        for (var i = 1; i <= 6; i++) {
            document.getElementById("stats-r-" + i).innerHTML =
                Statistics["gameStats"][i];
            var s_w_calc = 8;
            document.getElementById("stats-r-" + i).style.width =
                s_w_calc + "%";
        }
    } else {
        for (var i = 1; i <= 6; i++) {
            document.getElementById("stats-r-" + i).innerHTML =
                Statistics["gameStats"][i];
            var s_w_calc = (92 * Statistics["gameStats"][i]) / maxval + 8;
            document.getElementById("stats-r-" + i).style.width =
                s_w_calc + "%";
        }
    }

    if (CurrentGame["finished"] && CurrentGame["won"]) {
        document
            .getElementById("stats-r-" + CurrentGame["guesses"].length)
            .classList.add("current");
    }

    setPaths();
}

function bfs_pop(pop_list) {
    var explored = [];
    var queue = [[StartPlayer]];
    if (StartPlayer === EndPlayer) {
        return [start];
    }
    while (queue) {
        var path = queue.shift();
        var node = path[path.length - 1];

        if (!explored.includes(node)) {
            var adjs = PlayerTeammates[node];
            for (adj_id in adjs) {
                var adj = adjs[adj_id];
                if (pop_list.includes(adj)) {
                    var new_path = [...path];
                    new_path.push(adj);
                    queue.push(new_path);

                    if (adj === EndPlayer) {
                        return new_path;
                    }
                }
            }
            explored.push(node);
        }
    }
    return null;
}

function bfs() {
    var explored = [];
    var queue = [[StartPlayer]];
    if (StartPlayer === EndPlayer) {
        return [start];
    }
    while (queue) {
        var path = queue.shift();
        var node = path[path.length - 1];

        if (!explored.includes(node)) {
            var adjs = PlayerTeammates[node];
            for (adj_id in adjs) {
                var adj = adjs[adj_id];
                var new_path = [...path];
                new_path.push(adj);
                queue.push(new_path);
                if (adj === EndPlayer) {
                    return new_path;
                }
            }
            explored.push(node);
        }
    }
    return null;
}

function syncLocalStorage() {
    localStorage.setItem("CurrentGame", JSON.stringify(CurrentGame));
    localStorage.setItem("Statistics", JSON.stringify(Statistics));
}

function addValuesToListIfNotExist(list, valuesToAdd) {
    const uniqueSet = new Set(list);
    for (const value of valuesToAdd) {
        if (!uniqueSet.has(value)) {
            uniqueSet.add(value);
        }
    }
    return Array.from(uniqueSet);
}

function setPaths() {
    let pos_path;
    let sho_path;

    // quick, not clean way to do
    try {
        pos_path = bfs_pop(
            addValuesToListIfNotExist(popular_players, [StartPlayer, EndPlayer])
        );
    } catch (err) {
        pos_path = null;
    }

    sho_path = bfs();

    if (pos_path === null) {
        document.getElementById("p-route-pop").style.display = "none";
    }

    if (sho_path === null) {
        document.getElementById("p-route-sho").style.display = "none";
    }

    var pos_string = "<span>" + PlayerIds[StartPlayer] + " &rarr; ";
    for (i = 1; i < pos_path.length - 1; i++) {
        pos_string +=
            '<span class="correct">' + PlayerIds[pos_path[i]] + "</span> &rarr; ";
    }
    pos_string += PlayerIds[EndPlayer] + "</span>";

    var sho_string = "<span>" + PlayerIds[StartPlayer] + " &rarr; ";
    for (i = 1; i < sho_path.length - 1; i++) {
        sho_string +=
            '<span class="correct">' + PlayerIds[sho_path[i]] + "</span> &rarr; ";
    }
    sho_string += PlayerIds[EndPlayer] + "</span>";

    document.getElementById("p-route-pop").innerHTML = pos_string;
    document.getElementById("p-route-sho").innerHTML = sho_string;
}

function winStatic() {
    document
        .getElementById("next-pt")
        .style.setProperty("display", "none", "important");
    document
        .getElementsByClassName("stats-modal-share")[0]
        .style.setProperty("display", "block");
    document
        .getElementsByClassName("stats-modal-shortest-path")[0]
        .style.setProperty("display", "block");
    //document.getElementById("path-phrase").innerHTML = "Alternate";
}

function loseStatic() {
    document
        .getElementById("next-pt")
        .style.setProperty("display", "none", "important");
    document
        .getElementsByClassName("stats-modal-share")[0]
        .style.setProperty("display", "block");
    document
        .getElementsByClassName("stats-modal-shortest-path")[0]
        .style.setProperty("display", "block");
    //document.getElementById("path-phrase").innerHTML = "Possible";
}

async function init() {
    var loading = new ldBar("#loading-bar", {
        type: "fill",
        "fill-dir": "btt",
        "fill-background": "#fff2e2",
        "fill-width": 20,
        "img-size": "300,300",
        value: 0,
    });
    await loadPlayerId();
    await loadPlayerTeammates();
    await loadPlayerDefaultDates();

    var player_names = [];
    for (var key in PlayerIds) {
        player_names.push(PlayerIds[key]);
    }

    setTodayPlayers();
    if (localStorage.getItem("CurrentGame") !== null) {
        CurrentGame = JSON.parse(localStorage.getItem("CurrentGame"));
        if (CurrentGame["id"] !== btoa(getDate())) {
            CurrentGame = {
                id: btoa(getDate()),
                guesses: [],
                finished: false,
                won: false,
            };
        }
        document.getElementById("info-modal").style.display = "none";
    }

    if (localStorage.getItem("Statistics") !== null) {
        Statistics = JSON.parse(localStorage.getItem("Statistics"));
        document.getElementById("info-modal").style.display = "none";
    }
    syncLocalStorage();

    document.getElementById("p-start").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("p-end").innerHTML = PlayerIds[EndPlayer];
    document.getElementById("ui").value = "";

    document.getElementById("start-player").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("end-player").innerHTML = PlayerIds[EndPlayer];

    for (let x = 0; x < CurrentGame["guesses"].length; x++) {
        renderGuess(
            CurrentGame["guesses"][x][0],
            CurrentGame["guesses"][x][1],
            x
        );
    }
    updateGuessCnt();

    if (CurrentGame["finished"]) {
        if (CurrentGame["won"]) {
            winStatic();
        }
        if (!CurrentGame["won"]) {
            loseStatic();
        }
    }

    //initialized
    setTimeout(function () {
        loading.set(100, true);
        setTimeout(function () {
            document.getElementById("loading-screen").style.display = "none";
            autocomplete(document.getElementById("ui"), player_names);
        }, 2000);
    }, 700);
}

function game_end(won) {
    CurrentGame["finished"] = true;
    CurrentGame["won"] = won;

    Statistics["gamesPlayed"]++;
    if (won) {
        winStatic();
        Statistics["currentStreak"]++;
        Statistics["gamesWon"]++;
        if (Statistics["currentStreak"] > Statistics["maxStreak"]) {
            Statistics["maxStreak"] = Statistics["currentStreak"];
        }
        Statistics["gameStats"][CurrentGame["guesses"].length]++;
    } else {
        loseStatic();
        Statistics["currentStreak"] = 0;
        Statistics["gameStats"]["fail"]++;
    }

    syncLocalStorage();
    setTimeout(function () {
        stats_modal.style.display = "flex";
        update_stats_modal();
    }, 1300);
}

function autocomplete(inp, arr) {
    // W3Schools autocomplete
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i;
        var val = inp.value;
        closeAllLists();

        if (!val) {
            return false;
        }
        currentFocus = -1;

        // create auto complete list
        a = document.createElement("div");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        // add list to autocomplete wrapper
        document.getElementById("autocomplete-wrapper").appendChild(a);

        // populate auto complete
        var result_count = 0;
        for (i = 0; i < arr.length && result_count < 10; i++) {
            if (
                arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()
            ) {
                result_count++;
                b = document.createElement("div");
                b.innerHTML =
                    "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML +=
                    "<input type='hidden' value='" +
                    getKeyByValue(PlayerIds, arr[i]) +
                    "'>";
                b.addEventListener("click", function (e) {
                    // add onclick event listener for each div
                    /*insert the value for the autocomplete text field:*/
                    var input_id = parseInt(
                        this.getElementsByTagName("input")[0].value
                    );
                    inp.innerHTML = PlayerIds[input_id];
                    closeAllLists();

                    // check if player is correct
                    if (PlayerTeammates[PrevPlayer].includes(input_id)) {
                        PrevPlayer = parseInt(input_id);
                        addGuess(
                            input_id,
                            true,
                            CurrentGame["guesses"].length - 1
                        );
                        if (PlayerTeammates[PrevPlayer].includes(EndPlayer)) {
                            //if player won remove next field box
                            game_end(true);
                        }
                    } else {
                        addGuess(
                            input_id,
                            false,
                            CurrentGame["guesses"].length - 1
                        );
                    }

                    updateGuessCnt();
                    inp.value = "";

                    if (getRemainingGuesses() <= 0) {
                        game_end(false);
                    }
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            //up
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
        if (currentFocus < 0) currentFocus = x.length - 1;
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

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

window.onload = function () {
    init();
    console.log("loaded");
};
