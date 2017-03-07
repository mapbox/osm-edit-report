var R = require('ramda');
var fs = require('fs');
var json = fs.readFileSync('./test.json');


var data = JSON.parse(json);

var d = {};

Object.keys(data).forEach(hour => {
    var dataHour = data[hour];
    var users = Object.keys(dataHour);
    users.forEach(u => {
        if (Object.keys(dataHour).indexOf(u) > -1) {
            var tagKeys = ['tags_created', 'tags_modified', 'tags_deleted'];
            var edit = dataHour[u];
            tagKeys.forEach(t => {
                var tagEdit = edit[t];
                if (tagEdit) {
                    var tags = Object.keys(tagEdit);
                    tags.forEach(t => {
                        if (t !== 'building') return;
                        var tagValues = tagEdit[t];
                        if (!d.t) { d.t = 0 };
                        var sum = 0;
                        Object.keys(tagValues).forEach(v => sum += tagValues[v]);
                        d.t += sum;
                    });
                }
            });
        }
    })
});

console.log(d);
