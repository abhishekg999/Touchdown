let PlayerIds;
let PlayerTeammates;

let StartPlayer;
let EndPlayer;
let PrevPlayer;

let Guesses = [];
let LatestGuessField = null;

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

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

async function init() {
    window.localStorage.clear();
    await loadPlayerId();
    await loadPlayerTeammates();

    var player_names = []
    for (var key in PlayerIds) {
        player_names.push(PlayerIds[key]);
    }

    StartPlayer = 5684;
    EndPlayer = 1246;

    PrevPlayer = StartPlayer;


    document.getElementById("p-start").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("p-end").innerHTML = PlayerIds[EndPlayer];
    document.getElementById("ui").innerHTML = "";

    document.getElementById("start-player").innerHTML = PlayerIds[StartPlayer];
    document.getElementById("end-player").innerHTML = PlayerIds[EndPlayer];

    for (let x = 0; x < Guesses.length; x++) {
        addGuess(Guesses[x][0], Guesses[x][1], x)
    }

    //initialized
    document.getElementById("loading-screen").style.display = "none";

    document.getElementById("ui").addEventListener("keypress", function(event) {
        console.log("keypressed");



    })

    autocomplete(document.getElementById("ui"), player_names);


}

function autocomplete(inp, arr) {
    // W3Schools autocomplete
    var currentFocus;
    inp.addEventListener("input", function(e) {

        var a, b, i;
        let ui = document.getElementById('ui');
        var val = ui.innerHTML;
        closeAllLists();

        if (!val) {
            return false;
        }
        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.innerHTML = this.getElementsByTagName("input")[0].value;
                    closeAllLists();


                    console.log(inp.innerHTML);
		            input_id = parseInt(getKeyByValue(PlayerIds, inp.innerHTML));
		            console.log(input_id);

		           
	                console.log(PlayerTeammates[PrevPlayer].includes(input_id))
	                if (PlayerTeammates[PrevPlayer].includes(input_id)) {
	                    Guesses.push([PlayerIds[input_id, true]])
	                    PrevPlayer = parseInt(input_id);
	                    addGuess(input_id, true, Guesses.length - 1)

	                if (PlayerTeammates[PrevPlayer].includes(EndPlayer)) { //if player won
                        document.getElementById("next-pt").style.setProperty("display", "none", "important");
	                }

	                } else {
	                    Guesses.push([PlayerIds[input_id, false]])
	                    addGuess(input_id, false, Guesses.length - 1)
	                }
	                inp.innerHTML = "";
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