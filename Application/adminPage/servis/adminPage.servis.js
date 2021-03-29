var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

function personTableCreate() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY,per_name varchar(50),per_surname varchar(50), per_password varchar(50), per_email varchar(50),per_img varchar(50),role varchar(1))', [], function(results) {});
    }, function(tx, error) {
        alert("Kayıt başarısız:" + error.message);
    });
}
personTableCreate();

function addEmployee(model2, foto) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO person(per_name, per_surname, per_password, per_email,per_img,role) VALUES (?,?,123456,?,?,0)', [model2.per_name, model2.per_surname, model2.per_email, foto], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

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

function updateEmployee(inputValues, filterGuide, img) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('UPDATE person SET per_name=?,per_surname=?,per_email=?,per_password=?,per_img=? WHERE id=?', [inputValues.per_name, inputValues.per_surname, inputValues.per_email, inputValues.per_password, img, filterGuide.id], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}

function deleteEmployee(selectedEmployee) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM person WHERE per_email=?', [selectedEmployee.per_email], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}

function emailControl() {
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

function deleteEmployeeRole(id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM role WHERE userId=?', [id], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}