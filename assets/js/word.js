if (!String.prototype.splice) { // NOT USED RIGHT NOW
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.spliceIns = function(start, delCount, newSubStr) {
        return this.slice(0, start) + ("<differ-ins>" + newSubStr + "</differ-ins>") + this.slice(start + Math.abs(delCount));
    };
};

class DifferIns extends HTMLElement {

};

class DifferDel extends HTMLElement {

};

customElements.define("differ-ins", DifferIns);
customElements.define("differ-del", DifferDel);

var bodyElements = $("body").find("*"); // NOT USED RIGHT NOW
var oldNode = ""; // NOT USED RIGHT NOW
var textMod = ""; // NOT USED RIGHT NOW
var punctuationCounter = 0;
var wordchangeCounter = 0;
var wordreplaceCounter = 0;
var textinsertCounter = 0;
var textdeleteCounter = 0;
var textreplaceCounter = 0;
var insertCounter = 0;
var deleteCounter = 0;
var moveCounter = 0;
var wrapCounter = 0;
var unwrapCounter = 0;
var joinCounter = 0;
var splitCounter = 0;
var replaceCounter = 0;

var modifiedText = "";
var isFirstEdit = false;
var isLastEdit = false;

// NOT USED RIGHT NOW
function insWithHtmlReplace(pos, old, content) {
    var text = "";
    if (pos === oldNode) {
        text = textMod;
    } else {
        text = bodyElements.find(pos)[0].innerText;
    };
    var index = text.search(old);
    var modText = text.splice(index + old.length, 0, ("<ins style='color: #2eb82e; text-decoration: none'>" + content + "</ins>"));
    bodyElements.find(pos).html(function(_, html) {
        return html.replace(html, modText);
    });
    oldNode = pos;
    textMod = modText;
};

// NOT USED RIGHT NOW
function delWithHtmlReplace(content, pos) {
    var regExp = new RegExp(content);
    if (pos === oldNode) {
        bodyElements.find(pos).html(function(_, html) {
            var res = textMod.replace(regExp, ("<del style='color: red'>" + content + "</del>"));
            textMod = res;
            return res;
        });
    } else {
        bodyElements.find(pos).html(function(_, html) {
            var res = html.replace(regExp, ("<del style='color: red'>" + content + "</del>"));
            textMod = res;
            return res;
        });
    };
    oldNode = pos;
};

// NOT USED RIGHT NOW
function insWithHtmlReplaceWithoutTag(pos, old, content) {
    var text = "";
    if (pos === oldNode) {
        text = textMod;
    } else {
        text = bodyElements.find(pos)[0].innerText;
    };
    var index = text.search(old);
    var modText = text.splice(index + old.length, 0, content);
    bodyElements.find(pos).html(function(_, html) {
        return html.replace(html, modText);
    });
    oldNode = pos;
    textMod = modText;
};

// NOT USED RIGHT NOW
function delWithHtmlReplaceWithoutTag(content, pos) {
    var regExp = new RegExp(content);
    if (pos === oldNode) {
        bodyElements.find(pos).html(function(_, html) {
            var res = textMod.replace(regExp, content);
            textMod = res;
            return res;
        });
    } else {
        bodyElements.find(pos).html(function(_, html) {
            var res = html.replace(regExp, content);
            textMod = res;
            return res;
        });
    };
    oldNode = pos;
};

function differDel(id, start, end) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del>" + doc.substring(start, end) + "</differ-del>" + doc.substring(end);
    document.getElementById(id).innerHTML = modText;
};

function differDelFirst(id, start, end) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del>" + doc.substring(start, end) + "</differ-del>" + doc.substring(end);
    document.getElementById(id).innerHTML = modText;
};

function differDelLast(id, start, end) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del>" + doc.substring(start, end) + "</differ-del>" + doc.substring(end);
    document.getElementById(id).innerHTML = modText;
};

function differIns(id, pos, content) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins>" + content + "</differ-ins>") + doc.slice(pos + 12);
    document.getElementById(id).innerHTML = modText;
};

function differInsWithoutShift(id, pos, content) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, pos) + ("<differ-ins>" + content + "</differ-ins>") + doc.slice(pos);
    document.getElementById(id).innerHTML = modText;
}

function differInsFirst(id, pos, content) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins>" + content + "</differ-ins>") + doc.slice(pos + 12);
    document.getElementById(id).innerHTML = modText;
};

function differInsLast(id, pos, content) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins>" + content + "</differ-ins>") + doc.slice(pos + 12);
    document.getElementById(id).innerHTML = modText;
};

function cleanHTML() {
    var tags = document.querySelector("#doc").querySelectorAll("*");
    for (var i = 0; i < tags.length; i++) {
        if(tags[i].innerHTML === "") {
            tags[i].parentNode.removeChild(tags[i]);
        };
    };
};

function newVisualize(id, edits) {
    
    for (let index = edits.length -1; index >= 0; index--) {
        if (index == 0) {
        };

        if (index == edits.length - 1) {
        };
        
        for (item of edits[index].items) {
            if (item.type === "TEXT") {
                switch (item.operation) {
                    case "PUNCTUATION":
                        if (item.items.length == 1) {
                           for (item of item.items){
                                if (item.operation === "DEL") {
                                    differDel(id, item.startPosition, item.endPosition);
                                } else if (item.operation === "INS") {
                                    differInsWithoutShift(id, item.position, item.content);
                                };
                            }; 
                        } else {
                            for (item of item.items) {
                                if (item.operation === "DEL") {
                                    differDel(id, item.startPosition, item.endPosition);
                                } else if (item.operation === "INS") {
                                    differIns(id, item.position, item.content);
                                };
                            };
                        };
                        punctuationCounter++;
                        break;

                    case "WORDCHANGE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                differIns(id, item.position, item.content);
                            };
                        };
                        wordchangeCounter++;
                        break;

                    case "WORDREPLACE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                               differIns(id, item.position, item.content);
                            };
                        };
                        wordreplaceCounter++;
                        break;

                    case "TEXTINSERT":
                        for (item of item.items){
                            if (item.operation === "INS") {
                                // TODO: decide if change to differInsWithoutShift or not
                                var doc = document.getElementById(id).innerHTML;
                                doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
                                var modText = doc.spliceIns((item.position), 0, (item.content));
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        textinsertCounter++;
                        break;

                    case "TEXTDELETE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            };
                        };
                        textdeleteCounter++;
                        break;

                    case "TEXTREPLACE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                differIns(id, item.position, item.content);
                            };
                        };
                        textreplaceCounter++;
                        break;
                
                    default:
                        break;
                };
            }  else if (item.type === "STRUCTURE") {
                switch (item.operation) {
                    case "INSERT":
                        for (item of item.items){
                            if (item.operation === "INS") {
                                differInsWithoutShift(id, item.position, item.content);
                            };
                        };
                        insertCounter++;
                        break;

                    case "DELETE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            };
                        };
                        deleteCounter++;
                        break;

                    case "MOVE":
                        for (item of item.items){
                            var startPos, endPos, pos;
                            pos = item.position;
                            startPos = item.startPosition;
                            endPos = item.endPosition;
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                if (pos == endPos) {
                                    differIns(id, item.position, item.content);
                                } else {
                                    differInsWithoutShift(id, item.position, item.content);
                                };
                            };
                        };
                        moveCounter++;
                        break;

                    case "WRAP":
                        for (item of item.items){
                            if (item.operation === "INS") {
                                differInsWithoutShift(id, item.position, item.content);
                            };
                        };
                        wrapCounter++;
                        break;

                    case "UNWRAP":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            };
                        };
                        unwrapCounter++;
                        break;

                    case "JOIN": // TODO: mettere a posto
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                differIns(id, item.position, item.content);
                            };
                        };
                        joinCounter++;
                        break;

                    case "SPLIT": // TODO: mettere a posto
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                differIns(id, item.position, item.content);
                            };
                        };
                        splitCounter++;
                        break;

                    case "REPLACE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(id, item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                               differIns(id, item.position, item.content);
                            };
                        };
                        replaceCounter++;
                        break;
                
                    default:
                        break;
                };
            };
        };
    };
    
    // NOT USED RIGHT NOW
    /*
    for (edit of edits) {
        for (item of edit.items) {
            if (item.type === "TEXT") {
                switch (item.operation) {
                    case "PUNCTUATION":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "WORDCHANGE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "WORDREPLACE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "TEXTINSERT":
                        for (item of item.items){
                            if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "TEXTDELETE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "TEXTREPLACE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector("#"+id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;
                
                    default:
                        break;
                }
            } else if (item.type === "STRUCTURE") {
                switch (item.operation) {
                    case "INSERT":
                        for (item of item.items){
                            if (item.operation === "INS") {
                                console.log(lengthAdded);
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                modText.replace(/&lt;/gm, '<');
                                modText.replace(/&gt;/gm, '>');
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "DELETE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "MOVE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "WRAP":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "UNWRAP":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "JOIN":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "SPLIT":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;

                    case "REPLACE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                var doc = document.getElementById(id).innerHTML;
                                var modText = doc.substr(0, (item.startPosition + lengthAdded)) + "<edits-tracker-del>" + item.content + "</edits-tracker-del>" + doc.substr(item.endPosition + lengthAdded);
                                //lengthAdded -= (item.endPosition - item.startPosition);
                                lengthAdded += 39;
                                document.getElementById(id).innerHTML = modText;
                            } else if (item.operation === "INS") {
                                var doc = document.getElementById(id).innerHTML;
                                //var doc = document.querySelector(id).textContent;
                                var modText = doc.spliceIns((item.position + lengthAdded), 0, (item.content));
                                lengthAdded += ((item.content).length + 39);
                                document.getElementById(id).innerHTML = modText;
                            };
                        };
                        break;
                
                    default:
                        break;
                };
            };
        };
    };
    */

    cleanHTML();

    showCounters();

};

function showCounters() {
    document.getElementById("edits").innerHTML = "<p>Punctuation: " + punctuationCounter + "</p><p> Word Change: " + wordchangeCounter + "</p><p> Word Replace: " + wordreplaceCounter + "</p><p> Text Insert: " + textinsertCounter + "</p><p> Text Delete: " + textdeleteCounter + "</p><p>Text Replace: " + textreplaceCounter + "</p><p> Insert: " + insertCounter + "</p><p> Delete: " + deleteCounter + "</p><p> Move: " + moveCounter + "</p><p>Wrap: " + wrapCounter + "</p><p> Unwrap: " + unwrapCounter + "</p><p> Join: " + joinCounter + "</p><p> Split: " + splitCounter + "</p><p> Replace: " + replaceCounter + "</p>";
};

// NOT USED RIGHT NOW
function visualize(html, edits) {

    edits.forEach(edit => {
        
        switch (edit.operation) {
            case "FIX":
                var oldContent = edit.old;

                edit.items.forEach(item => {
                    if (item.type === "TEXT") {

                    } else if (item.type === "STRUCTURE") {
                        
                    };
                });

                break;

            case "STYLE":
                var oldContent = edit.old;

                edit.items.forEach(item => {
                    if (item.type === "TEXT") {
                        switch (item.operation) {
                            case "PUNCTUATION":
                                item.items.forEach(item => {
                                    if (item.operation === "INS") {
                                        insWithHtmlReplaceWithoutTag(item.position, oldContent, item.content);
                                    } else if (item.operation === "DEL") {
                                        delWithHtmlReplace(item.content, item.position);
                                    };
                                });
                                break;

                            case "TEXTDELETE":
                                item.items.forEach(item => {
                                    if (item.operation === "DEL") {
                                        delWithHtmlReplace(item.content, item.position);
                                    };
                                });
                                break;

                            case "TEXTINSERT":
                                item.items.forEach(item =>{
                                    if (item.operation === "INS") {
                                        insWithHtmlReplace(item.position, oldContent, item.content);
                                    };
                                });
                                break;
                        
                            default:
                                break;
                        }
                    } else if (item.type === "STRUCTURE") {
                        switch (item.operation) {
                            case "SPLIT":
                                item.items.forEach(item => {
                                    insWithHtmlReplace(item.position, oldContent, item.content);
                                });
                                break;
                        
                            default:
                                break;
                        }
                    };
                });

                break;

            case "MEANING":
                var oldContent = edit.old;

                edit.items.forEach(item => {
                    if (item.type === "TEXT") {
                        switch (item.operation) {
                            case "PUNCTUATION":
                                item.items.forEach(item => {
                                    if (item.operation === "INS") {
                                        insWithHtmlReplace(item.position, oldContent, item.content);
                                    } else if (item.operation === "DEL") {
                                        delWithHtmlReplace(item.content, item.position);
                                    };
                                });
                                break;

                            case "WORDCHANGE":
                                
                                break;

                            case "WORDREPLACE":
                                item.items.forEach(item =>{
                                    if (item.operation === "INS") {
                                        insWithHtmlReplace(item.position, oldContent, item.content);
                                    } else if (item.operation === "DEL") {
                                        delWithHtmlReplace(item.content, item.position);
                                    };
                                });
                                break;

                            case "TEXTINSERT":
                                item.items.forEach(item =>{
                                    if (item.operation === "INS") {
                                        insWithHtmlReplace(item.position, oldContent, item.content);
                                    };
                                });
                                break;

                            case "TEXTDELETE":
                                item.items.forEach(item => {
                                    if (item.operation === "DEL") {
                                        delWithHtmlReplace(item.content, item.position);
                                    };
                                });
                                break;

                            case "TEXTREPLACE":
                                item.items.forEach(item => {
                                    if (item.operation === "INS") {
                                        // insert content in position
                                        var el = document.createElement("ins");
                                        var text = document.createTextNode(item.content);
                                        el.appendChild(text);
                                        el.style.color = "#2eb82e";
                                        el.style.textDecoration = "none";
                                        bodyElements.find(item.position).append(el);
                                    } else if (item.operation === "DEL") {
                                        // delete content in position
                                        bodyElements.find(item.position).wrapInner("<del style='color: red'></del>");
                                    }
                                });
                                break;
                        
                            default:
                                break;
                        }
                    } else if (item.type === "STRUCTURE") {
                        switch (item.operation) {
                            case "INSERT":
                                switch (item.scenario) {
                                    case "NEW FIRST CHILD":
                                        item.items.forEach(item => {
                                            // da modificare con i tag corretti
                                            bodyElements.find(item.position).prepend(item.content);
                                            bodyElements.find(item.position).children(":first-child").css({"color": "#2eb82e", "border": "2px solid #2eb82e"});
                                        });
                                        break;

                                    case "NEW CHILD":
                                        item.items.forEach(item => {
                                            // da modificare con i tag corretti
                                            bodyElements.find(item.position).before(item.content);
                                            bodyElements.find(item.position).css({"color": "#2eb82e", "border": "2px solid #2eb82e"});
                                        });
                                        break;

                                    case "NEW LAST CHILD":
                                        item.items.forEach(item => {
                                            bodyElements.find(item.position).append("<ins style='color: #2eb82e; text-decoration: none'>" + item.content + "</ins>");
                                        });
                                        break;
                                };
                                break;

                                case "DELETE":
                                    item.items.forEach(item => {
                                        if (item.operation === "DEL") {
                                            delWithHtmlReplace(item.content, item.position);
                                        };
                                    });
                                    break;

                                case "MOVE":
                                    item.items.forEach(item => {
                                        if (item.operation === "DEL") {
                                            delWithHtmlReplace(item.content, item.position);
                                        } else if (item.operation === "INS") {
                                            insWithHtmlReplace(item.position, oldContent, item.content);
                                        };
                                    });
                                    break;

                                case "WRAP":
                                    item.items.forEach(item => {
                                            
                                    });
                                    break;

                                case "UNWRAP":
                                    item.items.forEach(item => {
                                            
                                    });
                                    break;

                                case "JOIN":
                                    item.items.forEach(item => {
                                            
                                    });
                                    break;

                                case "SPLIT":
                                    item.items.forEach(item => {
                                        insWithHtmlReplace(item.position, oldContent, item.content);
                                    });
                                    break;

                                case "REPLACE":
                                    item.items.forEach(item => {
                                            
                                    });
                                    break;
                            
                                default:
                                    break;
                            }
                        };
                    });

                    break;

                default:
                    break;
        };
    });
};