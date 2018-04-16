var config = {
    apiKey: "AIzaSyBRtHr1HqVHCqlhOIwzOPrWxpKgDB9zvuk",
    authDomain: "employee-tracker-65e13.firebaseapp.com",
    databaseURL: "https://employee-tracker-65e13.firebaseio.com",
    projectId: "employee-tracker-65e13",
    storageBucket: "employee-tracker-65e13.appspot.com",
    messagingSenderId: "300908955427"
};
firebase.initializeApp(config);
var database = firebase.database();

var employee = {
    name,
    role,
    start,
    rate,
};
// Push employee record from form -> firebase; clear the form
$(document).on('click','#pushNew',function() {
    event.preventDefault();
    employee.name = $('#name').val().trim();
    employee.role = $('#role').val().trim();
    employee.start = moment($('#start').val().trim(), "MM/DD/YYYY").format("X"); // converts date -> unix
    employee.rate = $('#rate').val().trim();
    database.ref().push(employee);
    $("#name").val("");
    $("#role").val("");
    $("#start").val("");
    $("#rate").val("");
});
// Append employee to table when database receives new record 
database.ref().on('child_added', function(snapshot) {  
    var employee = snapshot.val();
    console.log(employee);
    employee.id = snapshot.key;

    var startDate = moment.unix(employee.start).format('M/D/YYYY'); //converts unix -> date
    var totalMonths = moment().diff(moment.unix(employee.start), "months");
    var totalPaid = employee.rate * totalMonths;

    var tRow = $('<tr data-id='+employee.id+'><td>' + employee.name + '</td><td>' + employee.role + '</td><td>' + startDate + '</td><td>$' + employee.rate + ' /mo.</td><td>' + totalMonths+' months</td><td>' + '$'+totalPaid + '</td></tr>');
    $('#tBody').append(tRow);
});
// Update table when employee record changes in firebase; remove outdated row; append updated row
firebase.database().ref().on('child_changed', function(snapshot) {
    employee = snapshot.val();
    startDate = moment.unix(employee.start).format('M/D/YYYY'); //converts unix -> date
    totalMonths = moment().diff(moment.unix(employee.start), "months");
    totalPaid = employee.rate * totalMonths;

    var toDelete = $('[data-id='+snapshot.key+']');
    // var toDelete = $('<tr data-id='+snapshot.key+'>'); //this didn't work
    toDelete.empty();

    tRow = $('<tr><td>' + employee.name + '</td><td>' + employee.role + '</td><td>' + startDate + '</td><td>$' + employee.rate + ' /mo.</td><<td>' + totalMonths+' months</td><td>' + '$'+totalPaid + '</td></tr>');
    $('#tBody').append(tRow);
});

    // var empStart = moment.unix(employee.start).utc();
    // console.log(empStart); //returns moment object
    // console.log('employee:' + snapshot.val().name);
    // if ($('<tr data-id='+snapshot.key+'>')) {
    // if ($('[data-id='+snapshot.key+']')) {
    //     console.log('true');
    //     $('tr 
    //     $('<tr data-id='+snapshot.key+'> ~ td').empty();
    //     $('tr ~ td').empty();
    //     this.$('<tr>').empty();
    //     $(this.$('<tr>')).empty();
    //     $('<tr data-id='+employee.id+'>').empty()
    // };
