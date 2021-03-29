var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

function getTicketsForRoleTable(userId) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select * from role where userId=? and roleTicket="to"', [userId], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error;
            });
        });
    })
}

function getTicketInfo(stringQueryy) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select * from ticket t join role r on t.id=r.ticketId join person p on r.userId=p.id join status s on t.status=s.id where ' + stringQueryy, [], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error;
            });
        });
    })
}

function getProId(proText) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select id from project where pro_title=?', [proText], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error;
            });
        });
    })
}

function getFromIddd(comeName) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select id from person where per_name=?', [comeName], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error;
            });
        });
    })
}