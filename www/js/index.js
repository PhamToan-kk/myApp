
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        databaseHandler.createDatabase()
        $("#listReviews").on("tap","li",function(){
            alert($(this).find("[name='name']").val())
        })
    // reviewHandler.loadReviews(displayReviews)

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        $("#listReviews").on("tap","li",function(){
            alert($(this).find('[name="name"]').html())
        })

    }
};
    

function addReview(){
  
    const rname = $("#rname").val()
    const rtype = $("#rtype").val()
    const time = $("#time").val()
    const price = $("#price").val()
    const serviceR = $("#serviceR").val()
    const cleanR = $("#cleanR").val()
    const foodR = $("#foodR").val()
    const note = $("#note").val()
    const nameReporter = $("#nameReporter").val()
    const averageR = Math.ceil((parseInt(serviceR) + parseInt(foodR) + parseInt(cleanR))/3)
    if( rname == ""){
        console.log('ranem',rname)
        $("#errRname").text("Restaurant name is required ")
        return false
    } 
    $("#errRname").text("")

    if(!time){
        $("#errTime").html("Visited time is required ")
        return false
    }
    $("#errTime").html("")

    if(!price){
        $("#errPrice").html("Price/ person is required ")
        return false
    }
    $("#errPrice").html("")

    if(price < 0){
        $("#errPrice").html("Price/ person > 0 ")
        return false
    }
    $("#errPrice").html("")

    if(!nameReporter){
        $("#errRrporter").html("nameReporter is required ")
        return false
    }
    $("#errRrporter").html("")
    
    reviewHandler.addReview(rname,rtype,time,price,serviceR,cleanR,foodR,note,nameReporter,averageR)
    console.log(rname,rtype,time,price,serviceR,cleanR,foodR,note,nameReporter,averageR)

    $("#rname").val("")
    $("#time").val("")
    $("#price").val("")
    $("#note").val("")
    $("#nameReporter").val("")

    $("#popupSuccess").popup("open");


}

var currentReviews={
    _id: -1,
    rname: "",
    averageR:-1,
    price:-1,
    rtype:"",
    note:""    
    }

function displayReviews(results){
    var length = results.rows.length;
    var listReviews = $("#listReviews");
    //  $("#errMsg1").text("Restaurant name is required ")
    listReviews.empty()
    console.log('list',results.rows)
    for(var i = 0; i< length; i++){
        const item = results.rows.item(i);
        console.log(item)
        const a = $(`<a class="childItem"/>`);
        const h32 = $("<h3 />").text("Id: ");
        const h3 = $("<h3 />").text("Restaurant: ");
        const h4 = $("<h4 />").text("Average Rating: ");
        const h42 = $("<h4 />").text("Restaurant type: ");
        const p = $("<p />").text("Price/person: ");
        var p2 = $("<p />").text("Note: ");

        const spanId = $("<span />").text(item._id);
        spanId.attr("name", "_id");
        const spanName = $("<span />").text(item.rname);
        spanName.attr("name", "rname");
        const spandAverageR = $("<span/>").text(item.averageR + " ⭐️") ;
        spandAverageR.attr("name", "averageR" );
        const spandType = $("<span/>").text(item.rtype) ;
        spandType.attr("name", "rtype" );
        const spanPrice = $("<span />").text(item.price + " $");
        spanPrice.attr("name", "price");
        const spanNote = $("<span />").text(item.note);
        spanNote.attr("name", "note");

        h32.append(spanId);
        h3.append(spanName);
        h4.append(spandAverageR)
        h42.append(spandType)
        p.append(spanPrice);
        p2.append(spanNote)

        a.append(h32)
        a.append(h3);
        a.append(h4);
        a.append(h42)
        a.append(p);
        a.append(p2)
        const li = $(`<li class="RItem"/>`);
        
        li.attr("data-filtertext", item.rname);
        li.append(a);
        listReviews.append(li);
    }
    listReviews.listview("refresh");
    listReviews.on("tap", "li", function(){
        currentReviews._id = $(this).find("[name='_id']").text();
        currentReviews.rname = $(this).find("[name='rname']").text();
        currentReviews.rtype = $(this).find("[name='rtype']").text();
        currentReviews.averageR = $(this).find("[name='averageR']").text();
        currentReviews.price = $(this).find("[name='price']").text();
        currentReviews.note = $(this).find("[name='note']").text();

        console.log(currentReviews)
        //Set event for the list item
        $("#popupUpdateDelete").popup("open");
    });
}



 function loadReviews (displayReviews){
    databaseHandler.db.readTransaction(
        function(tx){
            tx.executeSql(
                "select * from review",
                [],
                function(tx, results){
                    //Do the display
                    displayReviews(results);
                },
                function(tx, error){//TODO: Alert the message to user
                    console.log("Error while selecting the products" + error.message);
                }
            );
        }
    );
}


function deleteReview(){
    var r = confirm("Delete review\nName: "+currentReviews.rname+
                    "\nType: " + currentReviews.rtype+ "\nid" + currentReviews._id);

    if(r==true){
        // console.log('ccc',currentReviews.id)
        reviewHandler.deleteReview(currentReviews._id);
        loadReviews(displayReviews);
    }
    $("#popupUpdateDelete").popup("close");
}



//load Dialog
function loadDialog(){
    $("#txtNewNote").val(currentReviews.note);
    $("#txtRName").val(currentReviews.rname);    // alert($("#xx").val())

}

//update review

function updateReview(){
    const newNote = $("#txtNewNote").val();
    const newRname =  $("#txtRName").val();
    reviewHandler.updateReview(currentReviews._id, newNote,newRname);
    $("#popupUpdateSuccess").popup("open");

    // $("#updatedialog").dialog("close");
}

