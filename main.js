var express =require('express');
var Airtable = require('airtable');

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyPuN2OQLp2BOoza'}).base('appwkxndjhN4TwRIz');

const app=express();

app.use(express.static(__dirname + '/Public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.sendFile("Public/index.html");
})

app.get('/records', (req, res)=>{
    base('Schedule').select({
        view: 'Appointment Slots',
        filterByFormula: "NOT({Status} = 'Appointment Booked')"
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        res.send(JSON.stringify(records));
    });
});

app.post('/book', (req, res)=>{
    base('Schedule').update([
        {
          "id": req.body.id,
          "fields": {
            "Name": req.body.name,
            "Status": req.body.status
          }
        }
      ], function(err, records) {
        if (err) {
          res.send("Sorry, Some error occured")
          return;
        }
      });
    res.send("Your Appointment is successfull!");
});

app.listen( process.env.PORT || 3000, ()=>{
    console.log("listening to port 3000..")
})