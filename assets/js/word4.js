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

const inline_elements = [
    "a",
    "abbr",
    "acronym",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "br",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "datalist",
    "del",
    "dfn",
    "em",
    "embed",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "map",
    "mark",
    "meter",
    "noscript",
    "object",
    "output",
    "picture",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "script",
    "select",
    "slot",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "template",
    "textarea",
    "time",
    "u",
    "tt",
    "var",
    "video",
    "wbr"
];

const block_elements = [
    "address",
    "article",
    "aside",
    "blockquote",
    "details",
    "dialog",
    "dd",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "ol",
    "p",
    "pre",
    "section",
    "table",
    "ul"
]

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

function getEnclosingTag (text, pos, content, op) {
    // Get the correct context
    // Normally, the position is calculated over the NEWTEXT. The regexp must be executed over it.
    // The algorithm needs to create a pattern with the text at the position, in the
    //old
    let newContent = text.substring(pos, pos + content.length)
    //new
    let oldContent = text.substring(pos, pos + content.length)

    // If the new content is a sequence of open and close tags
    if (/^[<>]+/.test(newContent)) {
      newContent = text.substring(pos - content.length, pos).split(/[<>]/).splice(-1).pop()
    }
    if (/[<>]+$/.test(newContent)) {
      newContent = text.substring(pos - content.length, pos).split(/[<>]/).splice(-1).pop()
    }

    // Set left and right selector
    const left = '<[A-z\\/\\-\\d\\=\\"\\s\\:\\%\\.\\,\\(\\)\\#]*'
    const right = '[A-z\\/\\-\\d\\=\\"\\s\\:\\%\\.\\,\\(\\)\\#]*>'

    // Get list of matching patterns
    let matches = RegExp(`${left}${RegExp.escape(oldContent)}${right}`, 'g').execGlobal(text)

    // Check each matching tag
    for (const match of matches) {
      // Save upper vars
      const regexUpperIndex = match.index + match[0].length
      let diffUpperIndex = pos + content.length

      // If the DIFF is a DEL, then add its length to the regexUpperIndex
      if (op === diffType.mechanical.del) diffUpperIndex -= content.length

      // The regex result must contain the entire diff content MUST start before and end after
      if (match.index < pos && regexUpperIndex > diffUpperIndex) {
        // Retrieve XPATH and character position proper of the tag
        let tag = getCssSelector(text, match, pos)

        // TODO CHANGE
        if (tag === null) return null

        // Add a more specific selector
        tag.path = `#newTextTemplate${tag.path}`

        return {
          tag: document.querySelector(tag.path),
          index: tag.index
        }
      }
    }

    return null
}

function getCssSelector (text, tagString, pos) {
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

    /**
     *
     */
    const setSiblings = function (i, sibling) {
      // Left to end
      for (let j = i; j < previousTags.length; j++) {
        if ((previousTags[j].opening || j === previousTags.length - 1) && sibling.tag === previousTags[j].tag) {
          previousTags[j].pos++
        }

        if (previousTags[j].deepness !== sibling.deepness) break
      }
    }

    // When the the tag is retrieved, it should create its XPATH
    // Logging all of its parents I.E. everytime it finds a opening tag
    // const leftText = text.split(tagString[0])[0]
    const leftText = text.substring(0, pos)

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

      // Update deepness
      curr.deepness = deepness

      if (!curr.opening) curr.deepness = ++deepness

      if (curr.tag === 'img' || curr.tag === 'wbr' || curr.tag === 'link' || curr.tag === 'input') {
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
      if (parent.pos > 1) resultpath += `:nth-of-type(${parent.pos})`
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
 * @param {String} content - content of the diff
 * @param {String} operation - String representing the operation
 */
function differDel(start, content, operation, author) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");

    let span = document.createElement("span");
    let attr = document.createAttribute("data-differ-del");
    attr.value = "text " + operation;
    span.setAttributeNode(attr);
    let end = start + content.length;
    span.innerHTML = content;

    let span2 = document.createElement("span");
    let attr2 = document.createAttribute("data-differ-diff");
    span2.setAttributeNode(attr2);
    let data_toggle = document.createAttribute("data-toggle");
    data_toggle.value = "tooltip";
    let data_placement = document.createAttribute("data-placement");
    data_placement.value = "top";
    let data_title = document.createAttribute("title");
    if (typeof author !== "undefined") {
        data_title.value = author;
    } else {
        data_title.value = "unknown";
    }
    span2.setAttributeNode(data_toggle);
    span2.setAttributeNode(data_placement);
    span2.setAttributeNode(data_title);
    span2.append(span);

    let modText = doc.substring(0, start) + span2.outerHTML + doc.substring(end);
    modifiedText = modText;
};

/**
 * Handle the case of a structural delete
 * @param {number} start - start index of the diff
 * @param {String} content - content of the diff
 * @param {String} operation - String representing the operation
 */
function differDelStruct(start, content, operation, author) {       // TODO: aggiungere ciclo for e controllo su tag(decidere se quest'ultimo è necessario)
    var doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");

    let diff_span = document.createElement("span");
    let diff_attr = document.createAttribute("data-differ-diff");
    diff_span.setAttributeNode(diff_attr);
    let data_toggle = document.createAttribute("data-toggle");
    data_toggle.value = "tooltip";
    let data_placement = document.createAttribute("data-placement");
    data_placement.value = "top";
    let data_title = document.createAttribute("title");
    if (typeof author !== "undefined") {
        data_title.value = author;
    } else {
        data_title.value = "unknown";
    }
    diff_span.setAttributeNode(data_toggle);
    diff_span.setAttributeNode(data_placement);
    diff_span.setAttributeNode(data_title);

    let del_span = document.createElement("span");
    let del_attr = document.createAttribute("data-differ-del");
    del_attr.value = "structure " + operation;
    del_span.setAttributeNode(del_attr);
    let end = start + content.length;
    del_span.innerHTML = content;

    diff_span.append(del_span);
    let modText = doc.substring(0, start) + diff_span.outerHTML + doc.substring(end);
    modifiedText = modText;
};

function differDelUnwrap(start1, tag1, start2, tag2, author) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let del_content = doc.slice(start1, (start2 + tag2.length-1));
    let opening_tag = tag1.replace(/[<>/]/g, "");
    let diff_span = document.createElement("span");
    let diff_attr = document.createAttribute("data-differ-diff");
    diff_span.setAttributeNode(diff_attr);
    let data_toggle = document.createAttribute("data-toggle");
    data_toggle.value = "tooltip";
    let data_placement = document.createAttribute("data-placement");
    data_placement.value = "top";
    let data_title = document.createAttribute("title");
    if (typeof author !== "undefined") {
        data_title.value = author;
    } else {
        data_title.value = "unknown";
    }
    diff_span.setAttributeNode(data_toggle);
    diff_span.setAttributeNode(data_placement);
    diff_span.setAttributeNode(data_title);
    for (const index in inline_elements) {
        if (opening_tag == inline_elements[index]) {
            let del_span = document.createElement("span");
            let del_attr = document.createAttribute("data-differ-del");
            del_attr.value = "structure UNWRAP";
            del_span.setAttributeNode(del_attr);
            del_span.innerHTML = del_content;

            diff_span.append(del_span);
        } else if (opening_tag == block_elements[index]) {
            let del_span = document.createElement("span");
            let del_attr = document.createAttribute("data-differ-del");
            del_attr.value = "structure UNWRAP";
            del_span.setAttributeNode(del_attr);
            let content = doc.slice((start1 + tag1.length-1), (start2));
            del_span.innerHTML = content;

            diff_span.append(del_span);
        }
    }
    let modText = doc.substring(0, start1) + diff_span.outerHTML + doc.substring(start2 + tag2.length);
    modifiedText = modText;
};

/**
 * Handle the case of a DEL which I can't wrap in an HTML elements
 * @param {number} pos - position of the diff
 * @param {String} content - content of the diff
 */
function differDelWithoutWrap(pos, content) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let length = pos + content.length;
    let modText = doc.substring(0, pos) + doc.substring(length);
    modifiedText = modText;
}

/**
 * Wrap a textual insert in a span element with custom attributes - TEXTUAL INSERT
 * @param {number} pos - index of the insert
 * @param {String} content - content of the insert
 * @param {String} operation - String representing the operation
 */
function differIns(pos, content, operation, author) {
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
    let data_toggle = document.createAttribute("data-toggle");
    data_toggle.value = "tooltip";
    let data_placement = document.createAttribute("data-placement");
    data_placement.value = "top";
    let data_title = document.createAttribute("title");
    if (typeof author !== "undefined") {
        data_title.value = author;
    } else {
        data_title.value = "unknown";
    }
    span2.setAttributeNode(data_toggle);
    span2.setAttributeNode(data_placement);
    span2.setAttributeNode(data_title);
    span2.append(span);
    
    let modText = doc.substring(0, pos) + span2.outerHTML + doc.substring(pos);
    modifiedText = modText;
};

/**
 * Wrap a content into an HTML Element with custom attributes - STRUCTURAL INSERT
 * @param {number} pos - index of the diff
 * @param {String} content - content of the diff
 * @param {String} operation - String representing the operation
 */
function differInsStruct(pos, content, operation, author) {    // TODO: aggiungere ciclo for e controllo su tag(decidere se quest'ultimo è necessario)
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");

    let diff_div = document.createElement("div");
    let diff_attr = document.createAttribute("data-differ-diff");
    diff_div.setAttributeNode(diff_attr);
    let data_toggle = document.createAttribute("data-toggle");
    data_toggle.value = "tooltip";
    let data_placement = document.createAttribute("data-placement");
    data_placement.value = "top";
    let data_title = document.createAttribute("title");
    if (typeof author !== "undefined") {
        data_title.value = author;
    } else {
        data_title.value = "unknown";
    }
    diff_div.setAttributeNode(data_toggle);
    diff_div.setAttributeNode(data_placement);
    diff_div.setAttributeNode(data_title);

    let ins_div = document.createElement("div");
    let ins_attr = document.createAttribute("data-differ-ins");
    ins_attr.value = "structure " + operation;
    ins_div.setAttributeNode(ins_attr);
    ins_div.innerHTML = content;

    diff_div.append(ins_div);
    let modText = doc.substring(0, pos) + diff_div.outerHTML + doc.substring(pos);
    modifiedText = modText;
};

/**
 * Handles the case of WRAP - STRUCTURAL INSERT WRAP
 * @param {number} pos1 - start index of the diff
 * @param {String} content1 - opening tag of the diff
 * @param {number} pos2 - end index of the diff
 * @param {String} content2 - closing tag of the diff
 */
function differInsWrap(pos1, content1, pos2, content2, author) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let txt = doc.slice(pos1, pos2);
    let stringElement = content1 + txt + content2;
    let opening_tag = content1.replace(/[<>/]/g, "");
    for (const index in inline_elements) {
        if (opening_tag == inline_elements[index]) {
            let diff_span = document.createElement("span");
            let diff_attr = document.createAttribute("data-differ-diff");
            diff_span.setAttributeNode(diff_attr);
            let data_toggle = document.createAttribute("data-toggle");
            data_toggle.value = "tooltip";
            let data_placement = document.createAttribute("data-placement");
            data_placement.value = "top";
            let data_title = document.createAttribute("title");
            if (typeof author !== "undefined") {
                data_title.value = author;
            } else {
                data_title.value = "unknown";
            }
            diff_span.setAttributeNode(data_toggle);
            diff_span.setAttributeNode(data_placement);
            diff_span.setAttributeNode(data_title);

            let ins_span = document.createElement("span");
            let ins_attr = document.createAttribute("data-differ-ins");
            ins_attr.value = "structure WRAP";
            ins_span.setAttributeNode(ins_attr);
            ins_span.innerHTML = stringElement;

            diff_span.append(ins_span);
            let modText = doc.substring(0, pos1) + diff_span.outerHTML + doc.substring(pos2);
            modifiedText = modText;
        } else if (opening_tag == block_elements[index]) {
            let diff_div = document.createElement("div");
            let diff_attr = document.createAttribute("data-differ-diff");
            diff_div.setAttributeNode(diff_attr);
            let data_toggle = document.createAttribute("data-toggle");
            data_toggle.value = "tooltip";
            let data_placement = document.createAttribute("data-placement");
            data_placement.value = "top";
            let data_title = document.createAttribute("title");
            if (typeof author !== "undefined") {
                data_title.value = author;
            } else {
                data_title.value = "unknown";
            }
            diff_div.setAttributeNode(data_toggle);
            diff_div.setAttributeNode(data_placement);
            diff_div.setAttributeNode(data_title);

            let ins_div = document.createElement("div");
            let ins_attr = document.createAttribute("data-differ-ins");
            ins_attr.value = "structure WRAP";
            ins_div.setAttributeNode(ins_attr);
            ins_div.innerHTML = stringElement;

            diff_div.append(ins_div);
            let modText = doc.substring(0, pos1) + diff_div.outerHTML + doc.substring(pos2);
            modifiedText = modText;
        };
    };
};

/**
 * Handles the case of SPLIT - STRUCTURAL INSERT SPLIT
 * @param {number} pos - index of the split
 * @param {String} content - content of the split
 */
function differInsSplit(pos, content, author) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let char = content.indexOf(">");    // position of the first opening tag
    let char2 = content.indexOf(">", char+1);   // position of the second opening tag
    let stringAttr = " data-differ-ins='structure SPLIT'";
    let modContent = content.slice(0, char2) + stringAttr + content.slice(char2);
    let modText = doc.slice(0, pos) + modContent + doc.slice(pos);
    modifiedText = modText;
};

function differInsWithoutWrap(pos, content, author) {
    let doc = modifiedText;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    let modText = doc.substring(0, pos) + content + doc.substring(pos);
    modifiedText = modText;
};

/**
 * Handle the case where I need to execute a replace with several DEL and INS
 * @param {[number]} pos - Array of positions
 * @param {[String]} delContent - Array of contents of deletions
 * @param {[String]} insContent - Array of contents of insertions
 * @param {String} operation - operation of the diff
 */
function differReplace(pos, delContent, insContent, operation, author) {
    for (const index in pos) {
        let doc = modifiedText;
        doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
        if (delContent[index] !== "null") {
            let length = delContent[index].length;
            let diff_span = document.createElement("span");
            let diff_attr = document.createAttribute("data-differ-diff");
            diff_span.setAttributeNode(diff_attr);
            let data_toggle = document.createAttribute("data-toggle");
            data_toggle.value = "tooltip";
            let data_placement = document.createAttribute("data-placement");
            data_placement.value = "top";
            let data_title = document.createAttribute("title");
            if (typeof author !== "undefined") {
                data_title.value = author;
            } else {
                data_title.value = "unknown";
            }
            diff_span.setAttributeNode(data_toggle);
            diff_span.setAttributeNode(data_placement);
            diff_span.setAttributeNode(data_title);
            let del_span = document.createElement("span");
            let del_attr = document.createAttribute("data-differ-del");
            del_attr.value = "text " + operation;
            del_span.setAttributeNode(del_attr);
            del_span.innerHTML = delContent[index];
            diff_span.append(del_span);
            let modText = doc.slice(0, pos[index]) + diff_span.outerHTML + doc.slice(pos[index] + length);
            modifiedText = modText;
        } else if (insContent[index] !== "null") {
            let ins_span = document.createElement("span");
            let ins_attr = document.createAttribute("data-differ-ins");
            ins_attr.value = "text " + operation;
            ins_span.setAttributeNode(ins_attr);
            ins_span.innerHTML = insContent[index];
            let diff_span = document.createElement("span");
            let diff_attr = document.createAttribute("data-differ-diff");
            diff_span.setAttributeNode(diff_attr);
            let data_toggle = document.createAttribute("data-toggle");
            data_toggle.value = "tooltip";
            let data_placement = document.createAttribute("data-placement");
            data_placement.value = "top";
            let data_title = document.createAttribute("title");
            if (typeof author !== "undefined") {
                data_title.value = author;
            } else {
                data_title.value = "unknown";
            }
            diff_span.setAttributeNode(data_toggle);
            diff_span.setAttributeNode(data_placement);
            diff_span.setAttributeNode(data_title);
            diff_span.append(ins_span);
            let modText = doc.slice(0, pos[index]) + diff_span.outerHTML + doc.slice(pos[index]);
            modifiedText = modText;
        }
    }
};

function differReplaceStruct(pos, delContent, insContent, operation, author) {
    for (const index in pos) {
        let doc = modifiedText;
        doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
        if (delContent[index] !== "null") {
            let length = delContent[index].length;
            let diff_div = document.createElement("div");
            let diff_attr = document.createAttribute("data-differ-diff");
            let data_toggle = document.createAttribute("data-toggle");
            data_toggle.value = "tooltip";
            let data_placement = document.createAttribute("data-placement");
            data_placement.value = "top";
            let data_title = document.createAttribute("title");
            if (typeof author !== "undefined") {
                data_title.value = author;
            } else {
                data_title.value = "unknown";
            }
            diff_div.setAttributeNode(data_toggle);
            diff_div.setAttributeNode(data_placement);
            diff_div.setAttributeNode(data_title);
            diff_div.setAttributeNode(diff_attr);
            let del_div = document.createElement("div");
            let del_attr = document.createAttribute("data-differ-del");
            del_attr.value = "structural " + operation;
            del_div.setAttributeNode(del_attr);
            del_div.innerHTML = delContent[index];
            diff_div.append(del_div);
            let modText = doc.slice(0, pos[index]) + diff_div.outerHTML + doc.slice(pos[index] + length);
            modifiedText = modText;
        } else if (insContent[index] !== "null") {
            let ins_div = document.createElement("div");
            let ins_attr = document.createAttribute("data-differ-ins");
            ins_attr.value = "structural " + operation;
            ins_div.setAttributeNode(ins_attr);
            ins_div.innerHTML = insContent[index];
            let diff_div = document.createElement("div");
            let diff_attr = document.createAttribute("data-differ-diff");
            diff_div.setAttributeNode(diff_attr);
            let data_toggle = document.createAttribute("data-toggle");
            data_toggle.value = "tooltip";
            let data_placement = document.createAttribute("data-placement");
            data_placement.value = "top";
            let data_title = document.createAttribute("title");
            if (typeof author !== "undefined") {
                data_title.value = author;
            } else {
                data_title.value = "unknown";
            }
            diff_div.setAttributeNode(data_toggle);
            diff_div.setAttributeNode(data_placement);
            diff_div.setAttributeNode(data_title);
            diff_div.append(ins_div);
            let modText = doc.slice(0, pos[index]) + diff_div.outerHTML + doc.slice(pos[index]);
            modifiedText = modText;
        }
    }
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
    let noopCounter = 0;

    modifiedText = doc;

    for (let index = edits.length -1; index >= 0; index--) {

        let author = edits[index].by;

        for (item of edits[index].items) {
            if (item.type === "TEXT") {

                let operation = item.operation;

                switch (operation) {
                    case "PUNCTUATION":
                    let pPos = [], pDelContent = [], pInsContent = [];
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    pPos.push(mechanical_diff.startPosition); //TODO modify in .position
                                    pDelContent.push(mechanical_diff.content);
                                    pInsContent.push("null");
                                } else if (mechanical_diff.operation === "INS") {
                                    pPos.push(mechanical_diff.position);
                                    pInsContent.push(mechanical_diff.content);
                                    pDelContent.push("null");
                                }
                                if (pPos.length === item.items.length) {
                                    differReplace(pPos, pDelContent, pInsContent, operation, author);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation, author);
                                };
                            }
                        }; 
                        punctuationCounter++;
                        break;

                    case "WORDCHANGE":
                    let wcPos = [], wcDelContent = [], wcInsContent = [];
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    wcPos.push(mechanical_diff.startPosition); //TODO modify in .position
                                    wcDelContent.push(mechanical_diff.content);
                                    wcInsContent.push("null");
                                }
                                if (mechanical_diff.operation === "INS") {
                                    wcPos.push(mechanical_diff.position);
                                    wcInsContent.push(mechanical_diff.content);
                                    wcDelContent.push("null");
                                }
                                if (wcPos.length === item.items.length) {
                                    differReplace(wcPos, wcDelContent, wcInsContent, operation, author);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation, author);
                                };
                            }
                        };
                        wordchangeCounter++;
                        break;

                    case "WORDREPLACE":
                    let wrPos = [], wrDelContent = [], wrInsContent = [];
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    wrPos.push(mechanical_diff.startPosition); //TODO modify in .position
                                    wrDelContent.push(mechanical_diff.content);
                                    wrInsContent.push("null");
                                }
                                if (mechanical_diff.operation === "INS") {
                                    wrPos.push(mechanical_diff.position);
                                    wrInsContent.push(mechanical_diff.content);
                                    wrDelContent.push("null");
                                }
                                if (wrPos.length === item.items.length) {
                                    differReplace(wrPos, wrDelContent, wrInsContent, operation, author);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation, author);
                                };
                            }
                        };
                        wordreplaceCounter++;
                        break;

                    case "TEXTINSERT":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "INS") {
                                differIns(mechanical_diff.position, mechanical_diff.content, operation, author);
                            };
                        };
                        textinsertCounter++;
                        break;

                    case "TEXTDELETE":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDel(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                            };
                        };
                        textdeleteCounter++;
                        break;

                    case "TEXTREPLACE":
                        let trPos = [], trDelContent = [], trInsContent = [];
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    trPos.push(mechanical_diff.startPosition);
                                    trDelContent.push(mechanical_diff.content);
                                    trInsContent.push("null");
                                } else if (mechanical_diff.operation === "INS") {
                                    trPos.push(mechanical_diff.position);
                                    trInsContent.push(mechanical_diff.content);
                                    trDelContent.push("null");
                                }
                                if (trPos.length === item.items.length) {
                                    differReplace(trPos, trDelContent, trInsContent, operation, author);
                                    //console.log(getEnclosingTag(doc, trPos, trDelContent));
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation, author);
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
                    case "NOOP":
                        for (let index = item.items.length -1; index >= 0; index--) {
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDelWithoutWrap(mechanical_diff.startPosition, mechanical_diff.content);
                            } else if (mechanical_diff.operation === "INS") {
                                differInsWithoutWrap(mechanical_diff.position, mechanical_diff.content, author);
                            };
                        };
                        noopCounter++;
                        break;
                    case "INSERT":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "INS") {
                                differInsStruct(mechanical_diff.position, mechanical_diff.content, operation, author);
                            };
                        };
                        insertCounter++;
                        break;

                    case "DELETE":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDelStruct(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                            };
                        };
                        deleteCounter++;
                        break;

                    case "MOVE":    // modificare: creare funz apposita da chiamare una volta aver checkato tutte le mech. Eseguire il del del nodo e l'ins del nodo nella nuova pos
                        let mvDelPos = [], mvInsPos = [], mvDelContent = [], mvInsContent = [];
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    mvDelPos.push(mechanical_diff.startPosition);
                                    mvDelContent.push(mechanical_diff.content);
                                };
                                if (mechanical_diff.operation === "INS") {
                                    mvInsPos.push(mechanical_diff.position);
                                    mvInsContent.push(mechanical_diff.content);
                                };
                                if (typeof mvDelPos !== "undefined" && typeof mvDelContent !== "undefined") {
                                    differDelStruct(mvDelPos, mvDelContent, operation, author);
                                };
                                if (typeof mvInsPos !== "undefined" && typeof mvInsContent !== "undefined") {
                                    differInsStruct(mvDelPos, mvDelContent, operation, author);
                                };
                            }
                            if (mechanical_diff.operation === "DEL") {
                                differDelStruct(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                            } else if (mechanical_diff.operation === "INS") {
                                differInsStruct(mechanical_diff.position, mechanical_diff.content, operation, author);
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
                        differInsWrap(pos1, content1, pos2, content2, author);
                        wrapCounter++;
                        break;

                    case "UNWRAP":
                        let startIndex1, startIndex2, tagContent1, tagContent2;
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                if (index == 0) {
                                    startIndex1 = mechanical_diff.startPosition;
                                    tagContent1 = mechanical_diff.content;
                                } else if (index == 1) {
                                    startIndex2 = mechanical_diff.startPosition;
                                    tagContent2 = mechanical_diff.content;
                                }
                            };
                        };
                        differDelUnwrap(startIndex1, tagContent1, startIndex2, tagContent2, author);
                        unwrapCounter++;
                        break;

                    case "JOIN": //I can't leave a track of the edit
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "DEL") {
                                differDel(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                            };
                        };
                        joinCounter++;
                        break;

                    case "SPLIT":
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (mechanical_diff.operation === "INS") {
                                differInsSplit(mechanical_diff.position, mechanical_diff.content, author);
                            };
                        };
                        splitCounter++;
                        break;

                    case "REPLACE":
                        let rPos = [], rDelContent = [], rInsContent = [];
                        for (let index = item.items.length -1; index >= 0; index--){
                            let mechanical_diff = item.items[index];
                            if (item.items.length > 1) {
                                if (mechanical_diff.operation === "DEL") {
                                    rPos.push(mechanical_diff.startPosition); //TODO modify in .position
                                    rDelContent.push(mechanical_diff.content);
                                    rInsContent.push("null");
                                } else if (mechanical_diff.operation === "INS") {
                                    rPos.push(mechanical_diff.position);
                                    rDelContent.push("null");
                                    rInsContent.push(mechanical_diff.content);
                                };
                                if (rPos.length === item.items.length) {
                                    differReplaceStruct(rPos, rDelContent, rInsContent, operation, author);
                                }
                            } else {
                                if (mechanical_diff.operation === "DEL") {
                                    differDel(mechanical_diff.startPosition, mechanical_diff.content, operation, author);
                                } else if (mechanical_diff.operation === "INS") {
                                    differIns(mechanical_diff.position, mechanical_diff.content, operation, author);
                                }
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
            "replace" : replaceCounter,
            "noop": noopCounter
        },
        "css": {
            "horizontal": [{
                "selector": "[data-differ-ins^='text']",
                "rules": {
                    "color": "#2eb82e"
                }
            }, {
                "selector": "[data-differ-ins^='structure'] *",
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
                "selector": "[data-differ-del^='structure'] *",
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
