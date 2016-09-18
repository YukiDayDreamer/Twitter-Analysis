// Give a 2D array based on the json's value in decreasing order
function sortJson(json) {
    var sortable = [];
    for (var item in json)
        sortable.push([item, json[item]]);
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    return sortable;
}

// Sort Objects in array based on key (descending) 
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return (
                (x > y) ? -1 : ((x < y) ? 1 : 0)
                );
    });
}
//// test data
//var people = [
//{
//    name: 'a75',
//    item1: false,
//    item2: false
//},
//{
//    name: 'z32',
//    item1: true,
//    item2: false
//},
//{
//    name: 'e77',
//    item1: false,
//    item2: false
//}];
//people = sortByKey(people, 'name');