var dates=[];
var records;
var id;

updateRecords();
function updateRecords() {
    $('.loader').removeClass('visually-hidden');
    $('.form-group').addClass('visually-hidden');
    $('.confirm').addClass('visually-hidden');
    $.ajax({
        type: "GET",
        url: "/records",
        success: function (res) {
            $('.form-group').removeClass('visually-hidden');
            $('.loader').addClass('visually-hidden');
            records=JSON.parse(res);
            records.forEach(e => {
                if(!dates.includes(e.fields.Date)){
                    dates.push(e.fields.Date);
                }
            });
            $('#date-selector').html("");
            $('#date-selector').append('<option value="select"> Select Date </option>');
            dates.forEach(e => {
                $('#date-selector').append('<option value="'+e+'">'+ e +'</option>');
            });
        }
    });    
}


document.getElementById('date-selector').addEventListener('change', ()=>{
    var sel = document.getElementById("date-selector");
    var dt= sel.options[sel.selectedIndex].text;
    $('#time-selector').html("");
    $('#time-selector').append('<option value="select"> Select Time </option>');
    records.forEach(e=>{
        if(e.fields.Date == dt){
            $('#time-selector').append('<option value="'+e.Slots+'">'+ e.fields.Slots +'</option>');
        }
    })
})

$('.form-group button')[0].addEventListener('click',()=>{
    //get date time and name filled by user
    var sel = document.getElementById("date-selector");
    var dt= sel.options[sel.selectedIndex].text;
    sel=document.getElementById("time-selector");
    var time= sel.options[sel.selectedIndex].text;
    id="someID";
    var name=$('[name="naem"]')[0].value;

    //check if user filled nothing
    if(name==''||time=="Select date first"||time=='Select Time'){
        $('.error').removeClass('visually-hidden');
        return;
    }
    $('.error').addClass('visually-hidden');

    //show loading
    $('.form-group').addClass('visually-hidden');
    $('.loader').removeClass('visually-hidden');
    
    //get ID of record chosen by user
    records.every(e => {
        if(e.fields.Date==dt && e.fields.Slots==time){
            id=e.id;
            return false;
        }
        return true;
    });

    //make AJAX post request to book the slot
    $.ajax({
        method: "POST",
        url: "/book",
        data: {"id": id, "name": name, "status": "Appointment Booked"},
        success: function (res) {
            console.log(res);
            $('.loader').addClass('visually-hidden');
            $('.confirm').removeClass('visually-hidden');
            $('.confirm').html("<h4>"+res+"</h4>" +'<button type="button" class="btn btn-outline-light mt-3" id="back"> Go back</button>');
            addlisteners();
        }
    });
})

function addlisteners() {
    $('#back')[0].addEventListener('click',()=>{
        updateRecords();
    })
}
