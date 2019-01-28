// TODO: spostarsi sulle strutturali perchè il timestamp si trova li
function showGitStyle(edits) {
    let json = {
        timestamps: []
    };
    
   let map = new Map();
   for (const diff of edits) {
       let timestamp = diff.timestamp;
       let date = new Date(timestamp);
       let year = date.getFullYear();
       let month = date.getMonth() + 1;
       let day = date.getDate();
       let fullDate = year + "-" + month + "-" + day;
       if (map.get(fullDate) == null) {
           map.set(fullDate, [diff]);
       } else {
          let temp_value = map.get(fullDate);
          temp_value.push(diff);
          map.set(fullDate, temp_value);
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
