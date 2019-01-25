
var str2DOMElement = function(html) {
    /* code taken from jQuery */
   var wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

        // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
        // unless wrapped in a div with non-breaking characters in front of it.
        _default: [ 1, "<div>", "</div>"  ]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var element = document.createElement('div');
    var match = /<\s*\w.*?>/g.exec(html);
    if(match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '');
        var map = wrapMap[tag] || wrapMap._default, element;
        html = map[1] + html + map[2];
        element.innerHTML = html;
        // Descend through wrappers to the right content
        var j = map[0]+1;
        while(j--) {
            element = element.lastChild;
        }
    } else {
        // if only text is passed
        element.innerHTML = html;
        element = element.lastChild;
    }
    return element;
};

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
    var span = document.createElement("span");
    var attr = document.createAttribute("data-differ-del");
    attr.value = "text";
    span.setAttributeNode(attr);
    var content = doc.substring(start, end);
    span.textContent = content;
    var modText = doc.substring(0, start) + span.outerHTML + doc.substring(end);
    modifiedText = modText;
};

function differDelStruct(start, end) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var attr = document.createAttribute("data-differ-del");
    attr.value = "structure";
    var content = doc.substring(start, end);
    var el = str2DOMElement(content);
    if (el.nodeType == 1) {
        el.setAttribute("data-differ-del", "structure");
        var modText = doc.substring(0, start) + el.outerHTML + doc.substring(end);
        modifiedText = modText;
    };
};

function differIns(pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var span = document.createElement("span");
    var attr = document.createAttribute("data-differ-ins");
    attr.value = "text";
    span.setAttributeNode(attr);
    span.innerText = content;
    var modText = doc.slice(0, (pos + 23)) + span.outerHTML + doc.slice(pos + 23);
    modifiedText = modText;
};

function differInsStruct(pos, content) {
    var el = str2DOMElement(content);
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var attr = document.createAttribute("data-differ-ins");
    attr.value = "structure";
    if (el !== null) {
        el.setAttributeNode(attr);
        var modText = doc.slice(0, (pos + 12)) + el.outerHTML + doc.slice(pos + 12);
        modifiedText = modText;
    };
};

function differInsWithoutShift(pos, content) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var span = document.createElement("span");
    var attr = document.createAttribute("data-differ-ins");
    attr.value = "text";
    span.setAttributeNode(attr);
    span.innerHTML = content;
    var modText = doc.slice(0, pos) + span.outerHTML + doc.slice(pos);
    modifiedText = modText;
};

function differInsWithoutShiftStruct(pos, content) {
    var el = str2DOMElement(content);
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var attr = document.createAttribute("data-differ-ins");
    attr.value = "structure";
    if (el !== null) {
        el.setAttribute("data-differ-ins", "structure");
        var modText = doc.slice(0, pos) + el.outerHTML + doc.slice(pos);
        modifiedText = modText;
    }
};

function cleanHTML() {
    var tags = document.querySelector("#doc").querySelectorAll("*");
    for (var i = 0; i < tags.length; i++) {
        if(tags[i].innerHTML === "") {
            tags[i].parentNode.removeChild(tags[i]);
        };
    };
};

function newVisualize(doc, edits) {

    modifiedText = doc;

    for (let index = edits.length -1; index >= 0; index--) {

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
                            var oldPosition;
                            
                            if (item.operation === "DEL") {
                                end = item.endPosition;
                                differDel(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                if (item.position > oldPosition) {
                                    console.log(item.content);
                                }
                                oldPosition = item.position;
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
                                differInsWithoutShiftStruct(item.position, item.content);
                            };
                        };
                        insertCounter++;
                        break;

                    case "DELETE":
                        for (item of item.items){
                            if (item.operation === "DEL") {
                                differDelStruct(item.startPosition, item.endPosition);
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
                                differDelStruct(item.startPosition, item.endPosition);
                            } else if (item.operation === "INS") {
                                differInsWithoutShiftStruct(item.position, item.content);
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
    
    return {
        "modifiedText" : modifiedText,
        "edits" : {
            "punctuation" : punctuationCounter,
            "wordChange" : wordchangeCounter,
            "wordReplace" : wordreplaceCounter,
            "textInsert" : textinsertCounter,
            "textDelete" : textdeleteCounter,
            "textReplace" : textreplaceCounter,
            "insert" : insertCounter,
            "delete" : deleteCounter,
            "move" : moveCounter,
            "wrap" : wrapCounter,
            "unwrap" : unwrapCounter,
            "join" : joinCounter,
            "split" : splitCounter,
            "replace" : replaceCounter
        }
    };

};
