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

RegExp.escape = function (string) {
    return string.replace(/[-\\/\\^$*+?.()|[\]{}#&;,]/g, '\\$&')
}

RegExp.prototype.execGlobal = function (text) {
    // Save matches
    let matches = []
    let match
  
    // Return all matches
    let tagSelectorRegexp = RegExp(this.source, this.flags)
    while ((match = tagSelectorRegexp.exec(text)) !== null) {
      matches.push(match)
    }
  
    return matches
}

function getEnclosingTag (text, pos, content) {
    // Get the correct context
    // Normally, the position is calculated over the NEWTEXT. The regexp must be executed over it.
    // The algorithm needs to create a pattern with the text at the position, in the
    let newContent = text.substring(pos, pos + content.length)


    // If the new content is a sequence of open and close tags
    if (/^[<>]+/.test(newContent)) {
      newContent = text.substring(pos - content.length, pos)
    }


    // Set left and right selector
    const left = '<[A-z\\/\\-\\d\\=\\"\\s\\:\\%\\.\\,\\(\\)\\#]*'
    const right = '[A-z\\/\\-\\d\\=\\"\\s\\:\\%\\.\\,\\(\\)\\#]*>'


    // Get list of matching patterns
    let matches = RegExp(`${left}${RegExp.escape(newContent)}${right}`, 'g').execGlobal(text)


    // Check each matching tag
    for (const match of matches) {
      // Save upper vars
      const regexUpperIndex = match.index + match[0].length
      let diffUpperIndex = this.pos + this.content.length


      // If the DIFF is a DEL, then add its length to the regexUpperIndex
      if (this.op === diffType.mechanical.del) diffUpperIndex -= this.content.length


      // The regex result must contain the entire diff content MUST start before and end after
      if (match.index < this.pos && regexUpperIndex > diffUpperIndex) {
        // Retrieve XPATH and character position proper of the tag
        let tag = this.getCssSelector(text, match)


        // TODO CHANGE
        if (tag === null) return null
        // Add a more specific selector
        tag.path = `#newTextTemplate${tag.path}`


        return document.querySelector(tag.path)
      }
    }


    return null
}

function   getCssSelector (text, tagString) {
    /**
     *
     */
    const initialiseTag = tag => {
      tag.tag = tag[0].replace(/[<>]/g, ' ').trim().split(/\s/)[0]
      tag.opening = tag.tag.indexOf('/') !== 0
      tag.tag = tag.tag.replace('/', '')
      tag.pos = 1


      return tag
    }


    // #newTextTemplate>div>table>tbody>tr:nth-child(10)>td>span>a>wbr


    /**
     *
     */
    const setSiblings = function (i, sibling) {
      // Left to end
      for (let j = i; j < previousTags.length; j++) {
        // If the parent is not a closing tag
        // Add the removing tag as his child
        if (previousTags[j].opening && sibling.tag === previousTags[j].tag) {
          previousTags[j].pos++
        }


        if (previousTags[j].deepness !== sibling.deepness) break
      }
    }


    // When the the tag is retrieved, it should create its XPATH
    // Logging all of its parents I.E. everytime it finds a opening tag
    // const leftText = text.split(tagString[0])[0]
    const leftText = text.substring(0, this.pos)


    // Match all of the opening and closing elements
    let previousTags = RegExp(`<\\/?[\\w]+[\\w\\/\\-\\d\\=\\"\\s\\:\\%\\#\\?\\;\\&\\.\\,\\(\\)\\{\\}\\!\\;\\+${regexp.accented}]*>`, 'g').execGlobal(leftText)


    // Add the current element
    previousTags.push(tagString)


    // Initialise all of the tags
    previousTags.map(tag => initialiseTag(tag))


    // Save the deepness
    let deepness = 0
    previousTags[previousTags.length - 1].deepness = deepness


    for (let i = previousTags.length - 2; i > 0; i--) {
      // Save the current tag
      let curr = previousTags[i]
      let next = previousTags[i + 1]


      if (!curr.opening) curr.deepness = ++deepness


      if (curr.tag === 'img' || curr.tag === 'wbr' || curr.tag === 'link') {
        previousTags.splice(i, 1)
        setSiblings(i, curr)
      } else if ((curr.opening && !next.opening) && next.tag === curr.tag) {
        previousTags.splice(i, 2)
        setSiblings(i, curr)
        deepness--
      }
    }


    // Build the resultpath
    let resultpath = ''
    for (const parent of previousTags) {
      // Add the tag name
      resultpath += `>${parent.tag}`


      // If the siblings are more than 1 write it on path
      if (parent.pos > 1) resultpath += `:nth-child(${parent.pos})`
    }


    // position and css selector
    return {
      index: previousTags.splice(-1).pop().index,
      path: resultpath
    }
}

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

function differReplace2(pos, delContent, insContent, operation) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let length = delContent.length;

    let del_span = document.createElement("span");
    let del_attr = document.createAttribute("data-differ-del");
    del_attr.value = "text " + operation;
    del_span.setAttributeNode(del_attr);
    del_span.innerHTML = delContent;

    let ins_span = document.createElement("span");
    let ins_attr = document.createAttribute("data-differ-ins");
    ins_attr.value = "text " + operation;
    ins_span.setAttributeNode(ins_attr);
    ins_span.innerHTML = insContent;

    let diff_span = document.createElement("span");
    let diff_attr = document.createAttribute("data-differ-diff");
    diff_span.setAttributeNode(diff_attr);
    diff_span.append(del_span);
    diff_span.append(ins_span);

    let modText = doc.slice(0, pos) + diff_span.outerHTML + doc.slice(pos + length);
    modifiedText = modText;
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

                switch (operation) {
                    case "PUNCTUATION":
                    let pPos, pDelContent, pInsContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    pPos = mechanical_diff.startPosition;
                                    pDelContent = mechanical_diff.content;
                                } else if (mechanical_diff.operation === "INS") {
                                    pInsContent = mechanical_diff.content;
                                }
                                if (typeof pPos !== "undefined" && typeof pDelContent !== "undefined" && typeof pInsContent !== "undefined") {
                                    differReplace2(pPos, pDelContent, pInsContent, operation);
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
                    let wcPos, wcEndContent, wcInsContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    wcPos = mechanical_diff.startPosition;
                                    wcDelContent = mechanical_diff.content;
                                }
                                if (mechanical_diff.operation === "INS") {
                                    wcInsContent = mechanical_diff.content;
                                }
                                if (typeof wcPos !== "undefined" && typeof wcEndContent !== "undefined" && typeof wcInsContent !== "undefined") {
                                    differReplace2(wcPos, wcEndContent, wcInsContent, operation);
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
                    let wrPos, wrDelContent, wrIsnContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    wrPos = mechanical_diff.startPosition;
                                    wrDelContent = mechanical_diff.content;
                                }
                                if (mechanical_diff.operation === "INS") {
                                    wrInsContent = mechanical_diff.content;
                                }
                                if (typeof wrPos !== "undefined" && typeof wrDelContent !== "undefined" && typeof wrInsContent !== "undefined") {
                                    differReplace2(wrPos, wrDelContent, wrInsContent, operation);
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
                        let trPos, trDelContent, trInsContent;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    trPos = mechanical_diff.startPosition;
                                    trDelContent = mechanical_diff.content;
                                }
                                if (mechanical_diff.operation === "INS") {
                                    trInsContent = mechanical_diff.content;
                                }
                                if (typeof trPos !== "undefined" && typeof trDelContent !== "undefined" && typeof trInsContent !== "undefined") {
                                    differReplace2(trPos, trDelContent, trInsContent, operation);
                                    //console.log(getEnclosingTag(doc, trPos, trDelContent));
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
