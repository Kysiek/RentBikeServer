var express = require('express');
var app = express();

app.get('/listUsers', function (req, res) {
  var users = [
    {
      name: "Kysiek",
      phone: "2134234"
    },
    {
      name: "asdsd",
      phone: "dddsdsd231"
    }
  ];
  res.status(200).json(users);
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port)

});