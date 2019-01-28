function wikiStyle(edits) {
    var json = {
        edits: []
    };
    var index = 1;

    edits.map(function(item) {

        let operation;
        let delContent = [];
        let insContent = [];
        let structuralItems = item.items

        for (const i in structuralItems) {
            operation = structuralItems[i].operation;
            let mechanicalItems = structuralItems[i].items;
            for (const n in mechanicalItems) {
                if (mechanicalItems[n].operation == "DEL") {
                    delContent.push(mechanicalItems[n].content);
                } else if (mechanicalItems[n].operation == "INS") {
                    insContent.push(mechanicalItems[n].content);
                };
            };
        };

        json.edits.push({
            "index" : index,
            "oldContent" : item.old,
            "newContent" : item.new,
            "operation": operation,
            "delContent": delContent,
            "insContent": insContent
        });
        index++;
    });

    return json;
};

