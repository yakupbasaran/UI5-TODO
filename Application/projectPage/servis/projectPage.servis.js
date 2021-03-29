var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

function projectTableCreate() {

    db.transaction(function(tx) {

        tx.executeSql('CREATE TABLE IF NOT EXISTS project (id INTEGER PRIMARY KEY,pro_title varchar(200))', [], function(results) {

        });
    }, function(tx, error) {
        throw error.message;
    });
}
projectTableCreate();

function addProject(sText) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO project(pro_title) VALUES (?)', [sText], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function getValues() {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM project', [], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function updateProDialog(sText, id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('UPDATE project SET pro_title=? WHERE id=?', [sText, id], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function deleteProDialog(id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM project WHERE id=?', [id], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}