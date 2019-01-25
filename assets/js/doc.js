'use strict';

function getSelectionCharacterOffsetWithin(element) {
    var start = 0;
    var end = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            console.log(preCaretRange.selectNodeContents(element));
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            start = preCaretRange.toString().length;
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            end = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToStart", textRange);
        start = preCaretTextRange.text.length;
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        end = preCaretTextRange.text.length;
    }
    return { start: start, end: end };
}

function reportSelection() {
  var selOffsets = getSelectionCharacterOffsetWithin( document.querySelector("body") );
  //document.getElementById("selectionLog").innerHTML = "Selection offsets: " + selOffsets.start + ", " + selOffsets.end;
  console.log("start: " + selOffsets.start + ", end: " + selOffsets.end);
}

function getIndex() {
    var doc = document.getElementById("doc").innerHTML;
    doc = doc.replace(/(?:\r\n|\r|\n)/g, "");
    var sel = getSelection();
    if (sel.anchorNode === sel.extentNode) {
        var data = sel.anchorNode.data;
        //data = data.replace(/(?:\r\n|\r|\n)/g, "");
        var extOffset = sel.extentOffset;
        var ancOffset = sel.anchorOffset;
        var search = doc.indexOf(data);
        var startIndex = search + ancOffset;
        var endIndex = startIndex + (extOffset - ancOffset);
        console.log("start: " + startIndex + ", end: " + endIndex);
    } else {
        var ancData = sel.anchorNode.data;
        var extData = sel.extentNode.data;
        //ancData = ancData.replace(/(?:\r\n|\r|\n)/g, "");
        //extData = extData.replace(/(?:\r\n|\r|\n)/g, "");
        var extOffset = sel.extentOffset;
        var ancOffset = sel.anchorOffset;
        var search = doc.indexOf(ancData);
        var startIndex = search + ancOffset;
        var length = (sel.anchorNode.length - ancOffset) + (sel.anchorNode.parentNode.localName.length + 3) + extOffset;
        var endIndex = startIndex + length;
        console.log("start: " + startIndex + ", end: " + endIndex);
    }
}

function getIndex2(oldText, newText) {

    let dmp = new diff_match_patch()

    let diffs = dmp.diff_main(oldText, newText)

    // Cleanup semantic
    // https://github.com/google/diff-match-patch/wiki/API#diff_cleanupsemanticdiffs--null
    dmp.diff_cleanupSemantic(diffs)

    // Get Patches
    // https://github.com/google/diff-match-patch/wiki/API#patch_makediffs--patches
    let patches = dmp.patch_make(diffs)

    // Create a temporary list of diffs
    let newDiffs = []

    // Iterate over patches
    for (let patch of patches) {
      // Set the absolute index
      let absoluteIndex = patch['start1']
      let diffs = patch['diffs']

      // Iterate over diffs
      diffs.map((diff, index) => {
        // Increase the current index by the length of current element, if it wasn't a DEL
        if (index > 0) {
          let previous = diffs[index - 1]
          if (previous[0] !== -1) {
            absoluteIndex += parseInt(previous[1].length)
          }
        }
        // Not_changed status doesn't matter
        if (diff[0] !== 0) {
          // Get mechanical type
          let op = diff['0'] === 1 ? diffType.mechanical.ins : diffType.mechanical.del

          // Update diffs
          newDiffs.push(new MechanicalDiff(op, diff['1'], absoluteIndex, newDiffs.length))
        }
      })
    }
    return newDiffs
}