var reviewHandler={
    addReview: function(rname,rtype,time, price,serviceR,cleanR,foodR,note,nameReporter,averageR){
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql(
                    "insert into review(rname,rtype,time,price,serviceR,cleanR,foodR,note,nameReporter,averageR ) values(?,?,?,?,?,?,?,?,?,?)",
                    [rname,rtype,time, price,serviceR,cleanR,foodR,note,nameReporter,averageR],
                    function(tx, results){},
                    function(tx, error){
                        console.log("add review error: " + error.message);
                    }
                );
            },
            function(error){},
            function(){}
        );
    },
    
    deleteReview:function(_id){
        // alert('haha')
        // alert('ahhah',_id)
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql(
                    "delete from review where _id = ?",
                    [_id],
                    function(tx, results){},
                    function(tx, error){//TODO: Could make an alert for this one.
                        console.log("Error happen when deleting: " + error.message);
                    }
                );
            }
        );
    },
    updateReview: function(_id, newNote,newRname,NewReporter){
        databaseHandler.db.transaction(
            function(tx){
                tx.executeSql(
                    "update review set rname=?, note=?,nameReporter=? where _id = ?",
                    [newRname,newNote,NewReporter, _id],
                    function(tx, result){},
                    function(tx, error){//TODO: alert/display this message to user
                        console.log("Error updating product" + error.message);
                    }
                );
            }
        );
    }
    };