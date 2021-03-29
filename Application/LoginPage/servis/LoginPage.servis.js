var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

function getTable() {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM person', [], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}

function nameSurname(model) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM person WHERE per_email=? and per_password=?', [model.email, model.password], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}