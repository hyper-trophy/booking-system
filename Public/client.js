var dates=[];
var result;
var id;
$('.form-group').addClass('visually-hidden');
$('.confirm').addClass('visually-hidden');
$.ajax({
    type: "GET",
    url: "/records",
    success: function (res) {
        $('.form-group').removeClass('visually-hidden');
        $('.loader').addClass('visually-hidden');
        result=JSON.parse(res);
        console.log(result);
        result.forEach(e => {
            if(!dates.includes(e.fields.Date)){
                dates.push(e.fields.Date);
            }
        });
        $('#date-selector')[0].options[0].text="Select date";
        dates.forEach(e => {
            $('#date-selector').append('<option value="'+e+'">'+ e +'</option>');
        });
    }
});

document.getElementById('date-selector').addEventListener('change', ()=>{
    var sel = document.getElementById("date-selector");
    var dt= sel.options[sel.selectedIndex].text;
    $('#time-selector').html("");
    $('#time-selector').append('<option value="select"> Select Time </option>');
    result.forEach(e=>{
        if(e.fields.Date == dt){
            $('#time-selector').append('<option value="'+e.Slots+'">'+ e.fields.Slots +'</option>');
        }
    })
})

$('.form-group button')[0].addEventListener('click',()=>{
    var sel = document.getElementById("date-selector");
    var dt= sel.options[sel.selectedIndex].text;
    sel=document.getElementById("time-selector");
    var time= sel.options[sel.selectedIndex].text;
    id="someID";
    var name=$('[name="naem"]')[0].value;
    if(name==''||time=="Select date first"||time=='Select Time'){
        $('.error').removeClass('visually-hidden');
        return;
    }
    $('.error').addClass('visually-hidden');

    $('.form-group').addClass('visually-hidden');
    $('.loader').removeClass('visually-hidden');
    
    result.every(e => {
        if(e.fields.Date==dt && e.fields.Slots==time){
            id=e.id;
            return false;
        }
        return true;
    });
    console.log(id+" "+name);
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
        $('.form-group').removeClass('visually-hidden');
        $('.confirm').addClass('visually-hidden');
    })
}
