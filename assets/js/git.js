function showGitStyle(edits) {
    let json = {
        timestamps: []
    };
    
   let map = new Map();
   for (const diff of edits) {
       let timestamp = diff.timestamp;
       if (map.get(timestamp) == null) {
           map.set(timestamp, [diff])
       } else {
           let temp_value = map.get(timestamp)
           temp_value.push(diff)
           map.set(timestamp, temp_value)
       }
   }

   let jsonMap = xah_map_to_obj(map)
   json.timestamps.push(jsonMap)
   
   return json;

};

const xah_map_to_obj = ( aMap => {
    const obj = {};
    aMap.forEach ((value, key) => { obj[key] = value });
    return obj;
});
