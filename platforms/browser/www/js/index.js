
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
    const averageR = ((parseInt(serviceR) + parseInt(foodR) + parseInt(cleanR))/3).toFixed(1)
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
    foodR:-1,
    cleanR:-1,
    serviceR:-1,
    averageR:-1,
    price:"",
    rtype:"",
    note:"",
    nameReporter:""    
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
        const id = $("<h3 />").text("Id: ");
        const h3Rname = $("<h3 />").text("Restaurant: ");
        const h4ARate = $("<h4 />").text("Average Rating: ");
        const h4Total = $("<h4 />").text("Rating service-clean-food: ");

        const h4Type = $("<h4 />").text("Restaurant type: ");
        const pPrice = $("<p />").text("Price/person: ");
        var pNote = $("<p />").text("Note: ");
        var pReporter = $("<p />").text("Reporter: ");


        const spanId = $("<span />").text(item._id);
        spanId.attr("name", "_id");
        const spanName = $("<span />").text(item.rname);
        spanName.attr("name", "rname");

        const spandTotalR = $("<span/>").text(item.serviceR + "⭐️" +"- " +item.cleanR + "⭐️" +"- " +item.foodR + "⭐️" ) ;
        spandTotalR.attr("name", "totalR" );
       
        const spandAverageR = $("<span/>").text(item.averageR +"/5" + " ⭐️") ;
        spandAverageR.attr("name", "averageR" );
        const spandType = $("<span/>").text(item.rtype) ;
        spandType.attr("name", "rtype" );
        const spanPrice = $("<span />").text(item.price + " $");
        spanPrice.attr("name", "price");
        const spanNote = $("<span />").text(item.note);
        spanNote.attr("name", "note");
        const spanReporter = $("<span />").text(item.nameReporter);
        spanReporter.attr("name", "nameReporter");

        id.append(spanId);
        h3Rname.append(spanName);
        h4Total.append(spandTotalR)
        h4ARate.append(spandAverageR)
        h4Type.append(spandType)
        pPrice.append(spanPrice);
        pNote.append(spanNote)
        pReporter.append(spanReporter)

        a.append(id)
        a.append(h3Rname);
        a.append(h4Total)
        a.append(h4ARate);
        a.append(h4Type)
        a.append(pPrice);
        a.append(pNote)
        a.append(pReporter)
        
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
        currentReviews.nameReporter = $(this).find("[name='nameReporter']").text();

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
    $("#txtNewReporter").val(currentReviews.nameReporter);    // alert($("#xx").val())


}

//update review

function updateReview(){
    const newNote = $("#txtNewNote").val();
    const newRname =  $("#txtRName").val();
    const NewReporter =  $("#txtNewReporter").val();

    reviewHandler.updateReview(currentReviews._id, newNote,newRname,NewReporter);
    $("#popupUpdateSuccess").popup("open");

    // $("#updatedialog").dialog("close");
}

