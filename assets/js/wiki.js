function showOld(id, edits) {
    var index = 1;
    var doc = "";
    for (edit of edits) {
        if (edit.old == "") {
            var text = ("<p style='height: 5rem; text-overflow: ellipsis'>Index: " + index + " <i> // </i></p><hr>");
        } else {
            var text = ("<p style='height: 5rem; text-overflow: ellipsis'>Index: " + index + " <i style='max-height: inherit; text-overflow: ellipsis'>" + edit.old + "</i></p><hr>");
        };
        doc += text;
        index++;
    };
    document.getElementById(id).innerHTML = doc;
};


function showOldAlt(edits) {
    var json = {
        edits: []
    };
    var index = 1;

    edits.map(function(item) {
        json.edits.push({
            "index" : index,
            "oldContent" : item.old,
            "newContent" : item.new
        });
        index++;
    });

    return json;
};


function showNew(id, edits) {
    var index = 1;
    var doc = "";
    for (edit of edits) {
        if (edit.new == "") {
            var text = ("<p style='height: 5rem; text-overflow: ellipsis'>Index: " + index + " <i> // </i></p><hr>");
        } else {
            var text = ("<p style='height: 5rem; text-overflow: ellipsis'>Index: " + index + " <i style='max-height: inherit; text-overflow: ellipsis'>" + edit.new + "</i></p><hr>");
        };
        doc += text;
        index++;
    };
    document.getElementById(id).innerHTML = doc;
};