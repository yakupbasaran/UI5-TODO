var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

function statusTableCreate() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS status (id INTEGER PRIMARY KEY,ticketstatus VARCHAR(50))', [], function(results) {});
    }, function(tx, error) {
        alert("Kayıt başarısız:" + error.message);
    });
}
statusTableCreate();

function getProjectValues() {
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

function projectTableCreate() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ticket (id INTEGER PRIMARY KEY,project VARCHAR(100),subject VARCHAR(100),startingdate VARCHAR(50),finishdate VARCHAR(50),status VARCHAR(50),FOREIGN KEY(status) REFERENCES status(id))', [], function(results) {});
    }, function(tx, error) {
        throw error.message;
    });
}
projectTableCreate();

function getTicketId() {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM ticket ', [], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function roleTableCreate() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY,userId VARCHAR(50),ticketId INTEGER,roleTicket VARCHAR(50),FOREIGN KEY(userId) REFERENCES person(id),FOREIGN KEY(ticketId) REFERENCES ticket(id))', [], function(results) {});
    }, function(tx, error) {
        throw error.message;
    });
}
roleTableCreate();

function insertRoleValues(userInformations, k, ticketId) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO role (userId,ticketId,roleTicket) VALUES (?,?,?) ', [userInformations[k].id, ticketId, userInformations[k].roleTicket], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function getStatusValues() {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM status', [], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function updateDeleteRole(tId) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('delete from role where ticketId=?', [tId], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function updateInsertRole(us, tId, ro) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO role (userId,ticketId,roleTicket) VALUES (?,?,?)', [us, tId, ro], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function deleteClickTicket(control) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('delete from ticket where id=? ', [control], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function deleteClickRole(control) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('delete from role where ticketId=? ', [control], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function inComingTicket(ticId) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select * from ticket where id=? ', [ticId], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function inComingToUserInfo(ticId) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select person.id,person.per_name,person.per_surname,role.roleTicket from person left join role on person.id=role.userId where ticketId=? and roleTicket="to"', [ticId], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}

function inComingFromUserInfo(ticId) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select person.id,person.per_name,person.per_surname from person left join role on person.id=role.userId where ticketId=? and roleTicket="from"', [ticId], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}

function getPersonValues() {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('select * from person', [], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}

function insertIntoTicket(addModel) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO ticket (project,subject,startingdate,finishdate,status)VALUES(?,?,?,?,?) ', [addModel.projectTitle, addModel.subject, addModel.startingdate, addModel.finishdate, addModel.status], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}

function ticUp(ticket) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('update ticket set project=?,subject=?,startingdate=?,finishdate=?,status=? where id=?', [ticket.projectTitle, ticket.subject, ticket.startingdate, ticket.finishdate, ticket.status, ticket.id], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });
    })
}

function ticUpToChange(ticket) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql('update ticket set project=?,subject=?,startingdate=?,finishdate=?,status=? where id=?', [ticket.projectTitle, ticket.subject, ticket.startingdate, ticket.finishdate, ticket.status, ticket.id], function(tx, results) {
                resolve(results);
            }, function(tx, error) {
                throw error.message;
            });
        });

    })
}