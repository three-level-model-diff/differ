/**
 * Transform a String in an HTML element. Code taken from jQuery.
 * @param {String} html - Template HTML
 * @returns {HTMLElement}
 */
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

/**
 * Variable used to store the modified text during the application of diffs
 */
let modifiedText = "";

/**
 * Wrap a textual delete in a span element with custom attributes - TEXTUAL DELETE
 * @param {number} start - start index of the diff
 * @param {number} end - end index of the diff
 * @param {String} operation - String representing the operation
 */
function differDel(start, end, operation) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let span = document.createElement("span");
    let attr = document.createAttribute("data-differ-del");
    attr.value = "text " + operation;
    span.setAttributeNode(attr);
    let content = doc.substring(start, end);
    span.textContent = content;
    // begin test
    let span2 = document.createElement("span");
    let attr2 = document.createAttribute("data-differ-diff");
    span2.setAttributeNode(attr2);
    span2.append(span);
    // end test
    let modText = doc.substring(0, start) + span2.outerHTML + doc.substring(end);
    modifiedText = modText;
};

/**
 * Add custom attributes in a node that is deleted - STRUCTURAL DELETE
 * @param {number} start - start index of the diff
 * @param {number} end - end index of the diff
 * @param {String} operation - String representing the operation
 */
function differDelStruct(start, end, operation) {
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var content = doc.substring(start, end);
    var el = str2DOMElement(content);
    if (el.nodeType == 1) {     //se nodeType è uguale ad 1, il nodo è un "element"
        let stringAttr = "structure " + operation;
        el.setAttribute("data-differ-del", stringAttr);
        var modText = doc.substring(0, start) + el.outerHTML + doc.substring(end);
        modifiedText = modText;
    };
};

function differDelUnwrap(start1, start2, end1, end2, content) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    
};

/**
 * Wrap a textual insert in a span element with custom attributes - TEXTUAL INSERT
 * @param {number} pos - index of the insert
 * @param {String} content - content of the insert
 * @param {String} operation - String representing the operation
 */
function differIns(pos, content, operation) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");

    let span = document.createElement("span");
    let attr = document.createAttribute("data-differ-ins");
    attr.value = "text " + operation;
    span.setAttributeNode(attr);
    span.innerHTML = content;

    let span2 = document.createElement("span");
    let attr2 = document.createAttribute("data-differ-diff");
    span2.setAttributeNode(attr2);
    span2.append(span);
    
    let modText = doc.slice(0, pos) + span2.outerHTML + doc.slice(pos);
    modifiedText = modText;
};

/**
 * Wrap a content into an HTML Element with custom attributes - STRUCTURAL INSERT
 * @param {number} pos - index of the diff
 * @param {String} content - content of the diff
 * @param {String} operation - String representing the operation
 */
function differInsStruct(pos, content, operation) {
    var el = str2DOMElement(content);
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var attr = document.createAttribute("data-differ-ins");
    let stringAttr = "structure " + operation;
    attr.value = stringAttr;
    if (el !== null) {
        el.setAttributeNode(attr);
        var modText = doc.slice(0, pos) + el.outerHTML + doc.slice(pos);
        modifiedText = modText;
    };
};

/**
 * Wrap a content into an HTML Element with custom attributes - STRUCTURAL INSERT
 * @param {number} pos - index of the diff
 * @param {String} content - content of the diff
 * @param {String} operation - String representing the operation
 */
function differInsWithoutShiftStruct(pos, content, operation) {
    var el = str2DOMElement(content);
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    if (el !== null) {
        let stringAttr = "structure " + operation;
        el.setAttribute("data-differ-ins", stringAttr);
        var modText = doc.slice(0, pos) + el.outerHTML + doc.slice(pos);
        modifiedText = modText;
    }
};

/**
 * Handles the case of WRAP - STRUCTURAL INSERT WRAP
 * @param {number} pos1 - start index of the diff
 * @param {String} content1 - opening tag of the diff
 * @param {number} pos2 - end index of the diff
 * @param {String} content2 - closing tag of the diff
 */
function differInsWrap(pos1, content1, pos2, content2) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let txt = doc.slice(pos1, pos2);
    let stringElement = content1 + txt + content2;
    let el = str2DOMElement(stringElement);
    if (el !== null) {
        el.setAttribute("data-differ-ins", "structure WRAP");
        let modText = doc.slice(0, pos1) + el.outerHTML + doc.slice(pos2);
        modifiedText = modText;
    }
};

/**
 * Handles the case of SPLIT - STRUCTURAL INSERT SPLIT
 * @param {number} pos - index of the split
 * @param {String} content - content of the split
 */
function differInsSplit(pos, content) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let char = content.indexOf(">");    // position of the first opening tag
    let char2 = content.indexOf(">", char+1);   // position of the second opening tag
    let stringAttr = " data-differ-ins='structure SPLIT'";
    let modContent = content.slice(0, char2) + stringAttr + content.slice(char2);
    let modText = doc.slice(0, pos) + modContent + doc.slice(pos);
    modifiedText = modText;
};

/**
 * 
 * @param {number} start - start index of the diff
 * @param {number} end - end index of the diff
 * @param {String} content - content of the diff
 * @param {String} operation - String representing the operation
 */
function differReplace(start, end, content, operation) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");

    let span = document.createElement("span");
    let attr = document.createAttribute("data-differ-del");
    attr.value = "text " + operation;
    span.setAttributeNode(attr);
    let cont = doc.substring(start, end);
    span.textContent = cont;

    let span2 = document.createElement("span");
    let attr2 = document.createAttribute("data-differ-ins");
    attr2.value = "text " + operation;
    span2.setAttributeNode(attr2);
    span2.innerHTML = content;

    let span3 = document.createElement("span");
    let attr3 = document.createAttribute("data-differ-diff");
    span3.setAttributeNode(attr3);
    span3.append(span);
    span3.append(span2);
    let modText = doc.slice(0, start) + span3.outerHTML + doc.slice(end);
    modifiedText = modText;
};

function differReplace2(start, end, content, operation) {

};

// da mettere a posto
function cleanHTML() {
    var tags = document.querySelector("#doc").querySelectorAll("*");
    for (var i = 0; i < tags.length; i++) {
        if(tags[i].innerHTML === "") {
            tags[i].parentNode.removeChild(tags[i]);
        };
    };
};

/**
 * 
 * @param {(String | HTML)} doc - original HTML
 * @param {JSON} edits - JSON of diffs
 * @returns {JSON}
 */
function newVisualize(doc, edits) {

    /**
     * Counters of diffs
     */
    let punctuationCounter = 0;
    let wordchangeCounter = 0;
    let wordreplaceCounter = 0;
    let textinsertCounter = 0;
    let textdeleteCounter = 0;
    let textreplaceCounter = 0;
    let insertCounter = 0;
    let deleteCounter = 0;
    let moveCounter = 0;
    let wrapCounter = 0;
    let unwrapCounter = 0;
    let joinCounter = 0;
    let splitCounter = 0;
    let replaceCounter = 0;

    modifiedText = doc;

    for (let index = edits.length -1; index >= 0; index--) {

        for (item of edits[index].items) {
            if (item.type === "TEXT") {

                let operation = item.operation;
                //let start, end, content;

                switch (operation) {
                    case "PUNCTUATION":
                    let pStart, pEnd, pContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    pStart = mechanical_diff.startPosition;
                                    pEnd = mechanical_diff.endPosition;
                                } else if (mechanical_diff.operation === "INS") {
                                    pContent = mechanical_diff.content;
                                }
                                if (typeof pStart !== "undefined" && typeof pEnd !== "undefined" && typeof pContent !== "undefined") {
                                    differReplace(pStart, pEnd, pContent, operation);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation);
                                };
                            }
                        }; 
                        punctuationCounter++;
                        break;

                    case "WORDCHANGE":
                    let wcStart, wcEnd, wcContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    wcStart = mechanical_diff.startPosition;
                                    wcEnd = mechanical_diff.endPosition;
                                }
                                if (mechanical_diff.operation === "INS") {
                                    wcContent = mechanical_diff.content;
                                }
                                if (typeof wcStart !== "undefined" && typeof wcEnd !== "undefined" && typeof wcContent !== "undefined") {
                                    differReplace(wcStart, wcEnd, wcContent, operation);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation);
                                };
                            }
                        };
                        wordchangeCounter++;
                        break;

                    case "WORDREPLACE":
                    let wrStart, wrEnd, wrContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    wrStart = mechanical_diff.startPosition;
                                    wrEnd = mechanical_diff.endPosition;
                                }
                                if (mechanical_diff.operation === "INS") {
                                    wrContent = mechanical_diff.content;
                                }
                                if (typeof wrStart !== "undefined" && typeof wrEnd !== "undefined" && typeof wrContent !== "undefined") {
                                    differReplace(wrStart, wrEnd, wrContent, operation);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation);
                                };
                            }
                        };
                        wordreplaceCounter++;
                        break;

                    case "TEXTINSERT":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "INS") {
                                differIns(mechanical_diff.position, mechanical_diff.content, operation);
                            };
                        };
                        textinsertCounter++;
                        break;

                    case "TEXTDELETE":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDel(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                            };
                        };
                        textdeleteCounter++;
                        break;

                    case "TEXTREPLACE":
                        let trStart, trEnd, trContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    trStart = mechanical_diff.startPosition;
                                    trEnd = mechanical_diff.endPosition;
                                }
                                if (mechanical_diff.operation === "INS") {
                                    trContent = mechanical_diff.content;
                                }
                                if (typeof trStart !== "undefined" && typeof trEnd !== "undefined" && typeof trContent !== "undefined") {
                                    differReplace(trStart, trEnd, trContent, operation);
                                    differReplace2(trStart, trEnd, trContent, operation);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation);
                                };
                            }
                        };
                        textreplaceCounter++;
                        
                        break;
                
                    default:
                        break;
                };
            }  else if (item.type === "STRUCTURE") {
                let operation = item.operation;
                switch (operation) {
                    case "INSERT":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "INS") {
                                differInsWithoutShiftStruct(mechanical_diff.position, mechanical_diff.content, operation);
                            };
                        };
                        insertCounter++;
                        break;

                    case "DELETE":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDelStruct(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                            };
                        };
                        deleteCounter++;
                        break;

                    case "MOVE":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDelStruct(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                            } else if (mechanical_diff.operation === "INS") {
                                differInsStruct(mechanical_diff.position, mechanical_diff.content, operation);
                            };
                        };
                        moveCounter++;
                        break;

                    case "WRAP":
                        let pos1, pos2, content1, content2;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "INS") {
                                if (index == 0) {
                                    pos1 = mechanical_diff.position
                                    content1 = mechanical_diff.content
                                } else if (index == 1) {
                                    pos2 = mechanical_diff.position
                                    content2 = mechanical_diff.content
                                }
                            };
                        };
                        differInsWrap(pos1, content1, pos2, content2);
                        wrapCounter++;
                        break;

                    case "UNWRAP":
                        let startIndex1, startIndex2, endIndex1, endIndex2, tagContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                if (index == 0) {
                                    startIndex1 = mechanical_diff.startPosition;
                                    endIndex1 = mechanical_diff.endPosition;
                                    tagContent = mechanical_diff.content;
                                } else if (index == 1) {
                                    startIndex2 = mechanical_diff.startPosition;
                                    endIndex2 = mechanical_diff.endPosition;
                                }
                                //differDelStruct(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                            };
                        };
                        differDelUnwrap(startIndex1, startIndex2, endIndex1, endIndex2, tagContent);
                        unwrapCounter++;
                        break;

                    case "JOIN": //TODO
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDel(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                            };
                        };
                        joinCounter++;
                        break;

                    case "SPLIT":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "INS") {
                                differInsSplit(mechanical_diff.position, mechanical_diff.content);
                            };
                        };
                        splitCounter++;
                        break;

                    case "REPLACE":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            /*
                            if (mechanical_diff.operation === "DEL") {
                                differDelStruct(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                            } else if (mechanical_diff.operation === "INS") {
                                differInsStruct(mechanical_diff.position, mechanical_diff.content, operation);
                            };
                            */
                           if (mechanical_diff.operation === "DEL") {
                               differDel(mechanical_diff.startPosition, mechanical_diff.endPosition, operation);
                           } else if (mechanical_diff.operation === "INS") {
                               differIns(mechanical_diff.position, mechanical_diff.content, operation);
                           }
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
        },
        "css": {
            "horizontal": [{
                "selector": "[data-differ-ins^='text']",
                "rules": {
                    "color": "#2eb82e"
                }
            }, {
                "selector": "[data-differ-ins^='structure']",
                "rules": {
                    "color": "#2eb82e !important",
                    "border": "1px solid #2eb82e"
                }
            }, {
                "selector": "[data-differ-del^='text']",
                "rules": {
                    "color": "red",
                    "text-decoration": "line-through"
                }
            }, {
                "selector": "[data-differ-del^='structure']",
                "rules": {
                    "color": "red",
                    "border": "1px solid red"
                }
            }],
            "vertical": [{
                "selector": "[data-differ-diff]",
                "rules": {
                    "display": "inline-table",
                    "vertical-align": "text-bottom",
                    "margin-top": "-2em"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-diff] [data-differ-del]:not(:only-child)",
                "rules": {
                    "vertical-align": "bottom",
                    "text-align": "center",
                    "line-height": "140%",
                    "font-size": "80%",
                    "position": "relative",
                    "top": "0.4em",
                    "color": "red",
                    "text-decoration": "line-through"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-diff] [data-differ-ins]:not(:only-child)",
                "rules": {
                    "display": "table-row",
                    "line-height": "140%",
                    "color": "#2eb82e"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-del^='structure']",
                "rules": {
                    "color": "red",
                    "border": "1px solid red"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-del^='structure'] *",
                "rules": {
                    "color": "red"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-ins^='structure']",
                "rules": {
                    "color": "#2eb82e !important",
                    "border": "1px solid #2eb82e"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-ins^='structure'] *",
                "rules": {
                    "color": "#2eb82e !important"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-ins$='split']",
                "rules": {
                    "color": "inherit !important"
                },
                "applyToParent": false
            }, {
                "selector": "[data-differ-diff] [data-differ-del]:only-child",
                "rules": {
                    "vertical-align": "unset"
                },
                "applyToParent": true
            }, {
                "selector": "[data-differ-diff] [data-differ-ins]:only-child",
                "rules": {
                    "vertical-align": "unset"
                },
                "applyToParent": true
            }]
        }
    };

};
