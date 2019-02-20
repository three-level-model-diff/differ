// diff's JSON of CAD v.2017 and v.2012
// these files must come from "3diff"s result
let CADedits2017 = $.getJSON("assets/docs/CAD-v.2005-03-07/CAD-v.2017-12-13.json");
let CADedits2012 = $.getJSON("assets/docs/CAD-v.2005-03-07/CAD-v.2012-10-18.json");

// the document chosen by the user
let doc;

// string identifing the document chosen
let docChosen;

// variable to contain CSS rules
let cssRules;

// string identifing the active style
let activeStyle;

// template HTML for nav-pills of style selection
let navPills = `<section class="section section-lg">
                    <ul class="nav nav-pills nav-pills-circle" style="justify-content: center" id="tabs_2" role="tablist">
                        <li class="nav-item" onclick="loadWordStyle()">
                            <h6>Word Style</h6>
                            <a class="nav-link rounded-circle active" id="home-tab" data-toggle="tab" href="#tabs_2_1" role="tab" aria-controls="home" aria-selected="true">
                            <span class="nav-link-icon d-block"><i class="far fa-file-word"></i></span>
                            </a>
                        </li>
                        <li class="nav-item" onclick="loadWikiStyle()">
                            <h6>Wiki Style</h6>
                            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#tabs_2_2" role="tab" aria-controls="profile" aria-selected="false">
                            <span class="nav-link-icon d-block"><i class="fab fa-wikipedia-w"></i></span>
                            </a>
                        </li>
                        <li class="nav-item" onclick="loadGitStyle()">
                            <h6>Git Style</h6>
                            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#tabs_2_3" role="tab" aria-controls="contact" aria-selected="false">
                            <span class="nav-link-icon d-block"><i class="fab fa-github"></i></span>
                            </a>
                        </li>
                    </ul>
                </section>`;

// template HTML for horizontal and vertical tabs and legend
let tabs = `<div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="card shadow border-0 mb-4">
                        <div class="row">
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <div class="card-body">
                                    <div class="container">
                                        <p style="font-weight: 500;">Legenda:</p>
                                        <p><span style="color: #2eb82e;">abc</span> textual insert</p>
                                        <p><span style="color: red; text-decoration: line-through;">abc</span> textual delete</p>
                                        <p><span style="border: 1px solid #2eb82e;">abc</span> structural insert</p>
                                        <p><span style="border: 1px solid red; color: red;">abc</span> structural delete</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-8 col-md-8 col-sm-8">
                                <div class="card-body text-justify">
                                    <p>Lo Stato, le Regioni e le autonomie locali assicurano la disponibilità, la gestione, l’accesso, la trasmissione, la conservazione e la fruibilità dell’informazione in modalità digitale e si organizzano ed agiscono a tale fine utilizzando con le modalità più appropriate e nel modo più adeguato al soddisfacimento degli interessi degli utenti le tecnologie dell’informazione e della comunicazione.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="nav-wrapper">
                <ul class="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-icons-text" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link mb-sm-4 mb-md-0 active" id="tabs-icons-text-1-tab" onclick="loadHorizontalCSS();" data-toggle="tab" href="#tabs-icons-text-1" role="tab" aria-controls="tabs-icons-text-1" aria-selected="true">Horizontal</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link mb-sm-4 mb-md-0" id="tabs-icons-text-2-tab" onclick="loadVerticalCSS();" data-toggle="tab" href="#tabs-icons-text-2" role="tab" aria-controls="tabs-icons-text-2" aria-selected="false">Vertical</a>
                    </li>
                </ul>
            </div>`;

// template HTML for word style section
let word = `<div class="row row-grid">
                <div class="col-lg-3 col-md-3 col-sm-3" id="col-3">
                    <div class="card shadow border-0">
                        <div class="card-body py-5">
                            <h4 class="text-default text-uppercase text-center">EDITS</h4>
                            <div class="container">
                                <p id="edits"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9 col-md-9 col-sm-9">
                    <div class="card shadow border-0">
                        <div class="card-body py-5">
                            <div class="container" id="doc">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

// template HTML for CAD version selection buttons
let cadButtons = `<button type="button" class="btn btn-outline-primary pressed" style="margin-bottom: 1rem;" id="v.2017-12-13">v.2017-12-13</button>
                <button type="button" class="btn btn-outline-primary not-pressed" style="margin-bottom: 1rem;" id="v.2012-10-18">v.2012-10-18</button>`;

// template HTML for Wiki style section
let wiki = `<section class="section section-lg pt-lg-0 mt--250">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-12">
                            <div class="row row-grid">
                                <div class="col-lg-6 col-md-6 col-sm-6">
                                    <div class="card shadow border-0">
                                        <div class="card-body py-5">
                                            <h6 class="text-primary text-uppercase">
                                                Old content
                                            </h6>
                                            <div id="old"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6">
                                    <div class="card shadow border-0">
                                        <div class="card-body py-5">
                                            <h6 class="text-primary text-uppercase">
                                                New content
                                            </h6>
                                            <div id="new"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;

// template HTML for Git style section
let git = `<section class="section section-lg pt-lg-0 mt--250">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-12">
                            <div class="card shadow py-5">
                                   <div class="container" id="git">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;

/**
 * Fired when CAD v.2017 is chosen. Set docChosen to "CAD2017" and load some HTML templates: nav-pills, word-style and cad-buttons
 */
function CAD2017chosen(event) {
    event.preventDefault();

    docChosen = "CAD2017";

    loadNavPills();
    loadWordStyle();

};

/**
 * Fired when CAD v.2012 is chosen. Set docChosen to "CAD2012" and load some HTML templates: nav-pills, word-style and cad-buttons
 */
function CAD2012chosen(event) {
    event.preventDefault();

    docChosen = "CAD2012";

    loadNavPills();
    loadWordStyle();

};

/**
 * Handles the injection of HTML template for nav-pills
 */
function loadNavPills() {

    let mod = document.getElementById("mod");
    mod.removeChild(mod.childNodes[1]);
    mod.insertAdjacentHTML("afterbegin", navPills);

};

/**
 * Handles the injection of HTML template for cad-buttons. Also adds a Event Listener on every button inserted
 */
function loadButtons() {
    document.getElementById("col-3").insertAdjacentHTML("afterbegin", cadButtons);
    document.getElementById("v.2017-12-13").addEventListener("click", function(event) {
        cadButton2017pressed(event);
    });
    document.getElementById("v.2012-10-18").addEventListener("click", function(event) {
        cadButton2012pressed(event);
    });
    if (docChosen == "CAD2017") {
        // toggle classes in CAD buttons
        document.getElementById("v.2017-12-13").classList.remove("not-pressed");
        document.getElementById("v.2017-12-13").classList.add("pressed");
        document.getElementById("v.2012-10-18").classList.remove("pressed");
        document.getElementById("v.2012-10-18").classList.add("not-pressed");
    } else if (docChosen == "CAD2012") {
        // toggle classes in CAD buttons
        document.getElementById("v.2017-12-13").classList.remove("pressed");
        document.getElementById("v.2017-12-13").classList.add("not-pressed");
        document.getElementById("v.2012-10-18").classList.remove("not-pressed");
        document.getElementById("v.2012-10-18").classList.add("pressed");
    };
};

/**
 * Applies the CSS rules for the vertical view
 */
function loadVerticalCSS() {
    let vertRules = cssRules.vertical;
    // iterate over vertical rules
    for (const index in vertRules) {
        // get selector, rule and boolean condition
        let selector = vertRules[index].selector;
        let rules = vertRules[index].rules;
        let apt = vertRules[index].applyToParent
        let keys = Object.keys(rules);
        for (let key of keys) {
            let rule = rules[key];
            if (apt) {
                // apply to parent
                $(selector).parent().css(key, rule);
            } else {
                // apply to element
                $(selector).css(key, rule);
            };
        };
    };
};

/**
 * Applies the CSS rules for the horizontal view
 */
function loadHorizontalCSS() {
    let horizRules = cssRules.horizontal;
    // iterate over horizontal rules
    for (const index in horizRules) {
        let selector = horizRules[index].selector;
        let rules = horizRules[index].rules;
        let keys = Object.keys(rules);
        for (let key of keys) {
            let rule = rules[key];
            // apply to element
            $(selector).css(key, rule);
        };
    };
};

/**
 * Handles an AJAX request to load CAD document in HTML and a call to Differ library for Word style.
 * /@param {JSON} edits - the JSON of diffs for the call to Differ library
 */
function loadCAD(edits) {
    $.ajax({
            context: this,
            dataType : "html",
            url : "assets/docs/CAD-v.2005-03-07/CAD-v.2005-03-07.html",
            success : function(results) {
                // store the document
                doc = results;
                // call Differ library to Word style
                let res = wordStyle(doc, edits.responseJSON);
                // store CSS rules
                cssRules = res.css;
                // show results
                document.getElementById("doc").innerHTML = res.modifiedText;
                // show edit counters
                document.getElementById("edits").innerHTML = "<p>Punctuation: " + res.edits.punctuation +
                     "</p><p> Word Change: " + res.edits.wordChange +
                         "</p><p> Word Replace: " + res.edits.wordReplace +
                             "</p><p> Text Insert: " + res.edits.textInsert +
                                 "</p><p> Text Delete: " + res.edits.textDelete +
                                     "</p><p>Text Replace: " + res.edits.textReplace +
                                         "</p><p> Insert: " + res.edits.insert +
                                             "</p><p> Delete: " + res.edits.delete +
                                                 "</p><p> Move: " + res.edits.move +
                                                     "</p><p>Wrap: " + res.edits.wrap +
                                                         "</p><p> Unwrap: " + res.edits.unwrap +
                                                             "</p><p> Join: " + res.edits.join +
                                                                 "</p><p> Split: " + res.edits.split +
                                                                     "</p><p> Replace: " + res.edits.replace +
                                                                        "</p><p> Noop: " + res.edits.noop + "</p>";
                // do a click on #tabs-icons-text-1-tab button
                document.getElementById("tabs-icons-text-1-tab").click();
            },
            error: function (error) {
                console.log(error);
            }
        });
};

/**
 * Function called by the Event Listener in the cad-button v.2012. Modifies the style of the buttons and load the right JSON of diffs
 */
function cadButton2012pressed(event) {
    event.preventDefault();
    // toggle classes in CAD buttons
    document.getElementById("v.2017-12-13").classList.remove("pressed");
    document.getElementById("v.2017-12-13").classList.add("not-pressed");
    document.getElementById("v.2012-10-18").classList.remove("not-pressed");
    document.getElementById("v.2012-10-18").classList.add("pressed");
    // load Word style for CAD v.2012
    loadCAD(CADedits2012);
    docChosen = "CAD2012";
};

/**
 * Function called by the Event Listener in the cad-button v.2017. Modifies the style of the buttons and load the right JSON of diffs
 */
function cadButton2017pressed(event) {
    event.preventDefault();
    // toggle classes in CAD buttons
    document.getElementById("v.2017-12-13").classList.remove("not-pressed");
    document.getElementById("v.2017-12-13").classList.add("pressed");
    document.getElementById("v.2012-10-18").classList.remove("pressed");
    document.getElementById("v.2012-10-18").classList.add("not-pressed");
    // load Word style for CAD v.2017
    loadCAD(CADedits2017);
    docChosen = "CAD2017";
};

/**
 * Functions to modify document from the navbar
 */
function changeCAD2012(event) {
    event.preventDefault();

    docChosen = "CAD2012";

    if (activeStyle == "Word") {
        loadWordStyle();
    } else if (activeStyle == "Wiki") {
        loadWikiStyle();
    } else if (activeStyle == "Git") {
        loadGitStyle();
    };
};

function changeCAD2017(event) {
    event.preventDefault();

    docChosen = "CAD2017";

    if (activeStyle == "Word") {
        loadWordStyle();
    } else if (activeStyle == "Wiki") {
        loadWikiStyle();
    } else if (activeStyle == "Git") {
        loadGitStyle();
    };
};

/**
 * Loads the HTML template for the Word style and the document chosen by the user. Also calls the Differ library
 */
function loadWordStyle() {

    // modify description seen in the top section of the page
    document.getElementById("word-header1").style.display = "block";
    document.getElementById("word-header2").style.display = "block";
    document.getElementById("wiki-header1").style.display = "none";
    document.getElementById("wiki-header2").style.display = "none";
    document.getElementById("git-header1").style.display = "none";
    document.getElementById("git-header2").style.display = "none";
    document.getElementById("doc-header").textContent = "Change the style to see what you can do!"

    let mod = document.getElementById("mod");
    mod.removeChild(mod.childNodes[2]);

    let div = document.createElement("div");
    // insert word HTML template
    div.insertAdjacentHTML("afterbegin", word);
    // insert tabs HTML template
    div.insertAdjacentHTML("afterbegin", tabs);

    mod.appendChild(div);
    
    if (docChosen == "CAD2017") {
        // load CAD buttons
        loadButtons();
        // load Word style for CAD v.2017
        loadCAD(CADedits2017);
    } else if (docChosen == "CAD2012") {
        // load CAD buttons
        loadButtons();
        // load Word style for CAD v.2012
        loadCAD(CADedits2012);
    };

    activeStyle = "Word";

};

/**
 * Loads the HTML template for the Wiki style. Also calls the Differ library
 */
function loadWikiStyle() {

    // variable to store the results of Differ library for Wiki style
    let results;

    // modify description seen in the top section of the page
    document.getElementById("word-header1").style.display = "none";
    document.getElementById("word-header2").style.display = "none";
    document.getElementById("wiki-header1").style.display = "block";
    document.getElementById("wiki-header2").style.display = "block";
    document.getElementById("git-header1").style.display = "none";
    document.getElementById("git-header2").style.display = "none";

    let div = document.createElement("div");
    div.insertAdjacentHTML("afterbegin", wiki);

    let versionBanner = document.createElement("p");
    versionBanner.classList.add("text-center");
    if (docChosen == "CAD2017") {
        versionBanner.innerText = "v. 2017-12-13";
    } else if (docChosen == "CAD2012") {
        versionBanner.innerText = "v. 2012-10-18";
    };

    let mod = document.getElementById("mod");
    mod.removeChild(mod.childNodes[2]);

    div.prepend(versionBanner);
    mod.appendChild(div);

    if (docChosen=="CAD2017") {
        // calls the library for Wiki style CAD v.2017
        results = wikiStyle(CADedits2017.responseJSON);
    } else if (docChosen == "CAD2012") {
        // calls the library for Wiki style CAD v.2012
        results = wikiStyle(CADedits2012.responseJSON);
    } else {
        // calls for others docs
    };
    
    showOldContentsAlt(results);
    showNewContentsAlt(results);

    activeStyle = "Wiki";
};

/**
 * Shows the results of Differ library in the HTML
 * @param {Array} results - Result array from Differ library
 */
function showOldContentsAlt(results) {
    for (i in results) {
        for (n in results[i]) {
            let div = document.createElement("div");
            div.classList.add("faded");
            div.addEventListener("click", function () {
                // when of a section of a edit in old column is triggered, it does the same to the correspondant section in new column
                if (this.style.height == "6.1rem") {
                    this.style.height = "auto";
                    this.classList.remove("faded");
                    let prev = this.previousElementSibling;
                    let index = 0;
                    while (prev !== null) {
                        prev = prev.previousElementSibling;
                        index++;
                    }
                    let height = this.getBoundingClientRect().height;
                    let newDiv = document.getElementById("new").children[index];
                    newDiv.style.height = height + "px";
                } else {
                    this.style.height = "6.1rem";
                    this.classList.add("faded");
                    let prev = this.previousElementSibling;
                    let index = 0;
                    while (prev !== null) {
                        prev = prev.previousElementSibling;
                        index++;
                    };
                    let height = this.getBoundingClientRect().height;
                    let newDiv = document.getElementById("new").children[index];
                    newDiv.style.height = height + "px";
                };
            });
            // create the elements to show the deleted content of edits..
            let p = document.createElement("p");
            let hr = document.createElement("hr");
            let operationSpan = document.createElement("span");
            operationSpan.classList.add("operation", "text-warning");
            operationSpan.textContent = results[i][n].operation + " - DEL";
            let contentSpan = document.createElement("span");
            contentSpan.classList.add("content");
            if (results[i][n].delContent == "") {
                operationSpan.textContent = "";
                contentSpan.textContent = "";
            } else {
                contentSpan.textContent = results[i][n].delContent;
            };
            // ..and append it to the page
            p.appendChild(operationSpan);
            p.appendChild(contentSpan);
            div.appendChild(p);
            document.getElementById("old").appendChild(div);
            document.getElementById("old").appendChild(hr);
        };
    };
};

/**
 * Shows the results of Differ library in the HTML
 * /@param {Array} results - Result array from Differ library
 */
function showNewContentsAlt(results) {
    for (i in results) {
        for (n in results[i]) {
            let div = document.createElement("div");
            div.classList.add("faded");
            div.addEventListener("click", function () {
                // when of a section of a edit in new column is triggered, it does the same to the correspondant section in old column
                if (this.style.height == "6.1rem") {
                    this.style.height = "auto";
                    this.classList.remove("faded");
                    let prev = this.previousElementSibling;
                    let index = 0;
                    while (prev !== null) {
                        prev = prev.previousElementSibling;
                        index++;
                    };
                    let height = this.getBoundingClientRect().height;
                    let oldDiv = document.getElementById("old").children[index];
                    oldDiv.style.height = height + "px";
                } else {
                    this.style.height = "6.1rem";
                    this.classList.add("faded");
                    let prev = this.previousElementSibling;
                    let index = 0;
                    while (prev !== null) {
                        prev = prev.previousElementSibling;
                        index++;
                    };
                    let height = this.getBoundingClientRect().height;
                    let oldDiv = document.getElementById("old").children[index];
                    oldDiv.style.height = height + "px";
                };
            });
            // create the elements to show the inserted content of edits..
            let p = document.createElement("p");
            let hr = document.createElement("hr");
            let operationSpan = document.createElement("span");
            operationSpan.classList.add("operation", "text-warning");
            operationSpan.textContent = results[i][n].operation + " - INS";
            let contentSpan = document.createElement("span");
            contentSpan.classList.add("content");
            if (results[i][n].insContent == "") {
                contentSpan.textContent = "";
            } else {
                contentSpan.textContent = results[i][n].insContent;
            };
            // ..and append it to the page
            p.appendChild(operationSpan);
            p.appendChild(contentSpan);
            div.appendChild(p);
            document.getElementById("new").appendChild(div);
            document.getElementById("new").appendChild(hr);
        };
    };
};

/**
 * Loads the HTML template for the Git style. Also calls the Differ library
 */
function loadGitStyle() {

    // modify description seen in the top section of the page
    document.getElementById("word-header1").style.display = "none";
    document.getElementById("word-header2").style.display = "none";
    document.getElementById("wiki-header1").style.display = "none";
    document.getElementById("wiki-header2").style.display = "none";
    document.getElementById("git-header1").style.display = "block";
    document.getElementById("git-header2").style.display = "block";

    let div = document.createElement("div");
    div.insertAdjacentHTML("afterbegin", git);

    let versionBanner = document.createElement("p");
    versionBanner.classList.add("text-center");
    if (docChosen == "CAD2017") {
        versionBanner.innerText = "v. 2017-12-13";
    } else if (docChosen == "CAD2012") {
        versionBanner.innerText = "v. 2012-10-18";
    };
    div.prepend(versionBanner);

    let mod = document.getElementById("mod");
    mod.replaceChild(div, mod.childNodes[2]);

    let res;
    if (docChosen == "CAD2017") {
        // calls Differ library for Git style
        
    } else if (docChosen == "CAD2012") {
        // calls Differ library for Git style
        res = showGitStyle(CADedits2012.responseJSON);
    }
    
    // stores the timestamps
    let ts = res.timestamps[0];
    let diffs = [];
    
    // iterate over timestamps and group edits with same timestamp
    for (const key in ts) {
        if (ts.hasOwnProperty(key)) {
            diffs = ts[key];
            let h5 = document.createElement("h5");
            h5.classList.add("text-primary");
            h5.textContent = key;
            $("#git").append(h5);
            let div = document.createElement("div");
            for (const diff of diffs) {
                let p = document.createElement("p");
                p.classList.add("diff-info", "fw-500");
                p.textContent = diff.id;
                let p1 = document.createElement("p");
                p1.classList.add("diff-info", "fw-500");
                p1.textContent = diff.operation;
                let p_new = document.createElement("p");
                p_new.classList.add("diff-info");
                p_new.textContent = "new: " + diff.new;
                let p_old = document.createElement("p");
                p_old.classList.add("diff-info");
                p_old.textContent = "old: " + diff.old;
                div.append(p);
                div.append(p1);
                div.append(p_new);
                div.append(p_old)
                let hr = document.createElement("hr");
                div.append(hr);
            };
            $("#git").append(div);
        };
    };

    activeStyle = "Git";

};