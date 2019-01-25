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

class DifferInsStruct extends HTMLElement {

};

class DifferDelStruct extends HTMLElement {

};

customElements.define("differ-ins", DifferIns);
customElements.define("differ-del", DifferDel);
customElements.define("differ-ins-struct", DifferInsStruct);
customElements.define("differ-del-struct", DifferDelStruct);

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

function differDel(start, end) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del>" + doc.substring(start, end) + "</differ-del>" + doc.substring(end);
    modifiedText = modText;
};

function differDelStruct(start, end) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del-struct>" + doc.substring(start, end) + "</differ-del-struct>" + doc.substring(end);
    modifiedText = modText;
};

function differDelFirst(id, start, end) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del>" + doc.substring(start, end) + "</differ-del>" + doc.substring(end);
    modifiedText = modText;
};

function differDelFirstStruct(id, start, end) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del-struct>" + doc.substring(start, end) + "</differ-del-struct>" + doc.substring(end);
    modifiedText = modText;
};

function differDelLast(id, start, end) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del>" + doc.substring(start, end) + "</differ-del>" + doc.substring(end);
    document.getElementById(id).innerHTML = modText;
};

function differDelLastStruct(id, start, end) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.substring(0, start) + "<differ-del-struct>" + doc.substring(start, end) + "</differ-del-struct>" + doc.substring(end);
    document.getElementById(id).innerHTML = modText;
};

function differIns(pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var element = document.createElement("differ-ins");
    element.innerText = content;
    var modText = doc.slice(0, (pos + 12)) + /*("<differ-ins>" + content + "</differ-ins>")*/element.outerHTML + doc.slice(pos + 12);
    modifiedText = modText;
};

function differInsStruct(pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins-struct>" + content + "</differ-ins-struct>") + doc.slice(pos + 12);
    modifiedText = modText;
};

function differInsWithoutShift(pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, pos) + ("<differ-ins>" + content + "</differ-ins>") + doc.slice(pos);
    modifiedText = modText;
};

function differInsWithoutShiftStruct(pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, pos) + ("<differ-ins-struct>" + content + "</differ-ins-struct>") + doc.slice(pos);
    modifiedText = modText;
};

function differInsFirst(id, pos, content) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins>" + content + "</differ-ins>") + doc.slice(pos + 12);
    modifiedText = modText;
};

function differInsFirstStruct(id, pos, content) {
    var doc = document.getElementById(id).innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins-struct>" + content + "</differ-ins-struct>") + doc.slice(pos + 12);
    modifiedText = modText;
};

function differInsLast(id, pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins>" + content + "</differ-ins>") + doc.slice(pos + 12);
    document.getElementById(id).innerHTML = modText;
};

function differInsLastStruct(id, pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var modText = doc.slice(0, (pos + 12)) + ("<differ-ins-struct>" + content + "</differ-ins-struct>") + doc.slice(pos + 12);
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

    console.log(edits);
    
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
                                    differDel(item.startPosition, item.endPosition);
                                } else if (item.operation === "INS") {
                                    differInsWithoutShift(item.position, item.content);
                                };
                            }; 
                        } else {
                            for (item of item.items) {
                                if (item.operation === "DEL") {
                                    differDel(item.startPosition, item.endPosition);
                                } else if (item.operation === "INS") {
                                    differIns(item.position, item.content);
                                };
                            };
                        };
                        punctuationCounter++;
                        break;

                    case "WORDCHANGE":
                        for (item of item.items){
                            var end;
                            if (item.operation === "DEL") {
                                end = item.endPosition;
                                differDel(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                if (item.position == end) {
                                    item.position += 13;
                                };
                                differIns(item.position, item.content);
                            };
                        };
                        wordchangeCounter++;
                        break;

                    case "WORDREPLACE":
                        for (item of item.items){
                            var end;
                            if (item.operation === "DEL") {
                                end = item.endPosition;
                                differDel(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                if (item.position == end) {
                                    item.position += 13;
                                };
                                differIns(item.position, item.content);
                            };
                        };
                        wordreplaceCounter++;
                        break;

                    case "TEXTINSERT":
                        for (item of item.items){
                            if (item.operation === "INS") {
                                differInsWithoutShift(item.position, item.content);
                            };
                        };
                        textinsertCounter++;
                        break;

                    case "TEXTDELETE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(item.startPosition, item.endPosition);
                            };
                        };
                        textdeleteCounter++;
                        break;

                    case "TEXTREPLACE":
                        for (item of item.items){
                            var end;
                            if (item.operation === "DEL") {
                                end = item.endPosition;
                                differDel(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                if (item.position == end) {
                                    item.position += 13;
                                };
                                differIns(item.position, item.content);
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
                                if (index == edits.length - 1) {
                                    differInsFirstStruct(id, item.position, item.content);
                                } else if (index == 0) {
                                    differInsLastStruct(id, item.position, item.content);
                                } else {
                                    differInsWithoutShiftStruct(item.position, item.content);
                                };
                            };
                        };
                        insertCounter++;
                        break;

                    case "DELETE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(item.startPosition, item.endPosition);
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
                                    differIns(item.position, item.content);
                                } else {
                                    differInsWithoutShift(item.position, item.content);
                                };
                            };
                        };
                        moveCounter++;
                        break;

                    case "WRAP":
                        for (item of item.items){
                            if (item.operation === "INS") {
                                differInsWithoutShift(item.position, item.content);
                            };
                        };
                        wrapCounter++;
                        break;

                    case "UNWRAP":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(item.startPosition, item.endPosition);
                            };
                        };
                        unwrapCounter++;
                        break;

                    case "JOIN": // TODO: mettere a posto
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                differIns(item.position, item.content);
                            };
                        };
                        joinCounter++;
                        break;

                    case "SPLIT": // TODO: mettere a posto
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                differInsWithoutShift(item.position, item.content);
                            };
                        };
                        splitCounter++;
                        break;

                    case "REPLACE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDel(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                               differIns(item.position, item.content);
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
    
    cleanHTML();

    showCounters();

};

function showCounters() {
    document.getElementById("edits").innerHTML = "<p>Punctuation: " + punctuationCounter + "</p><p> Word Change: " + wordchangeCounter + "</p><p> Word Replace: " + wordreplaceCounter + "</p><p> Text Insert: " + textinsertCounter + "</p><p> Text Delete: " + textdeleteCounter + "</p><p>Text Replace: " + textreplaceCounter + "</p><p> Insert: " + insertCounter + "</p><p> Delete: " + deleteCounter + "</p><p> Move: " + moveCounter + "</p><p>Wrap: " + wrapCounter + "</p><p> Unwrap: " + unwrapCounter + "</p><p> Join: " + joinCounter + "</p><p> Split: " + splitCounter + "</p><p> Replace: " + replaceCounter + "</p>";
};