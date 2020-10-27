var databaseHandler = {
    db: null,
    createDatabase: function(){
        this.db = window.openDatabase(
            "reviews.db",
            "1.0",
            "review database",
            1000000);
        this.db.transaction(
            function(tx){
                //Run sql here using tx
                tx.executeSql(
                    "create table if not exists review( _id integer primary key autoincrement,rname text, rtype text, time text , price integer , serviceR integer , cleanR integer ,foodR integer , note text , nameReporter text , averageR interger)",
                    // "drop table review",
                    [],
                    function(tx, results){},
                    function(tx, error){
                        console.log("Error while creating the table: " + error.message);
                    }
                );
            },
            function(error){
                console.log("Transaction error: " + error.message);
            },
            function(){
                console.log("Create DB transaction completed successfully");
            }
        );
    
    }
    }