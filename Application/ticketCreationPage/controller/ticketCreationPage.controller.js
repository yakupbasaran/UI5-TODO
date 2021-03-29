sap.ui.define([
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/Token',
    'SapUI5Tutorial/resources/component/customMultiInput'
], function(MessageToast, Controller, JSONModel, Token, customInput) {
    "use strict";
    var that;
    return Controller.extend("SapUI5Tutorial.Application.ticketCreationPage.controller.ticketCreationPage", {
        onInit: function() {
            that = this;
            var oView = this.getView();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        },
        getTicket: function(oEvent) {
            var param = oModel.getProperty("/whereIsComing");
            that.initial().then(res => {
                oModel.setProperty("/ticket", {});
                if (param != "ADD") {
                    that.getView().byId("deleteButton").setEnabled(true);
                    that.getView().byId("comboBoxStatus").setEnabled(true);
                    inComingTicket(param).then(function(res) {
                        var ticket = res.rows[0];
                        ticket.project = oModel.oData.projectValues.find(project => project.pro_title == ticket.project).id;
                        inComingToUserInfo(param).then(function(res) {
                            var toUsers = Object.assign([], res.rows);
                            var oMultiInput1 = that.getView().byId("multiInput");
                            toUsers.forEach(user => {
                                oMultiInput1.addToken(new sap.m.Token({ text: user.per_name + " " + user.per_surname, key: user.id }));
                            });
                            ticket.to = toUsers;
                            oModel.setProperty("/ticket", ticket);
                            oModel.setProperty("/saveToControl");
                            oModel.setProperty("/saveToControl", toUsers);

                            inComingFromUserInfo(param).then(function(res) {
                                ticket.from = res.rows[0].per_name + " " + res.rows[0].per_surname;
                                ticket.fromId = res.rows[0].id;
                            })
                        })
                    })
                } else {
                    that.getView().byId("deleteButton").setEnabled(false);
                    that.getView().byId("comboBoxStatus").setEnabled(false);
                    that.getView().byId("comboBoxStatus").setSelectedKey(1);
                    var ticket = oModel.getProperty("/ticket");
                    ticket.fromId = localStorage.getItem("userId");
                    ticket.from = localStorage.getItem("userName");
                }
            })
        },
        initial: function(oEvent) {
            return new Promise(function(resolve, reject) {
                getStatusValues().then(function(res) {
                    oModel.setProperty("/statusValues", Object.assign([], res.rows));
                    getProjectValues().then(function(res) {
                        oModel.setProperty("/projectValues", Object.assign([], res.rows));
                        resolve(true);
                    })
                })
            })
        },
        MultiControl: function() {
            getPersonValues().then(function(res) {
                var array2 = [];
                oModel.setProperty("/personValues", {});
                var model2 = oModel.getProperty("/personValues");
                for (var j = 0; j < res.rows.length; j++) {
                    model2.name = res.rows[j].per_name;
                    model2.surname = res.rows[j].per_surname;
                    model2.id = res.rows[j].id;
                    array2.push({
                        "name": model2.name + " " + model2.surname,
                        "id": model2.id
                    });
                    oModel.setProperty("/personValues", array2);
                }
            })
        },
        inputsClean: function() {
            var oView = that.getView();
            that.getView().byId("comboBox").setValue(null);
            that.getView().byId("comboBoxStatus").setValue(null);
            var oMultiInputRemove = oView.byId("multiInput");
            oMultiInputRemove.removeAllTokens();
            oModel.setProperty("/createTry", {});
            oModel.setProperty("/personValues", {});
            oModel.setProperty("/saveToControl", {});
            oModel.setProperty("saveInputTo", {});
            oModel.setProperty("/ticket", {});
        },
        saveTicket: function() {
            var pushArr = [];
            var ticket = oModel.getProperty("/ticket");
            oModel.setProperty("saveInputTo", {});
            ticket.projectTitle = oModel.oData.projectValues.find(project => project.id == parseInt(ticket.project)).pro_title;
            var controlUrl = oModel.getProperty("/whereIsComing");
            if (controlUrl == "ADD") {
                var addModel = oModel.getProperty("/ticket");
                addModel.status = "1";
                var userInformations = [];
                var toObject = {};
                var fromObject = {
                    "id": oModel.getProperty("/ticket").fromId,
                    "name": oModel.getProperty("/ticket").from,
                    "roleTicket": "from"
                };
                userInformations.push(fromObject);
                var tokenLength = this.getView().byId("multiInput").getTokens().length;
                for (var j = 0; j < tokenLength; j++) {
                    toObject = {
                        "id": this.getView().byId("multiInput").getTokens()[j].mProperties.key,
                        "name": this.getView().byId("multiInput").getTokens()[j].mProperties.text,
                        "roleTicket": "to"
                    };
                    userInformations.push(toObject);
                }
                insertIntoTicket(addModel).then(function(res) {
                    getTicketId().then(function(res) {
                        var resLength = res.rows.length;
                        var ticketId = Math.floor(res.rows[resLength - 1].id);
                        for (var k = 0; k < userInformations.length; k++) {
                            insertRoleValues(userInformations, k, ticketId).then(function(res) {
                                var msg = 'Ticket eklendi.';
                                MessageToast.show(msg);
                                that.inputsClean();
                                var orientation = sap.ui.controller("SapUI5Tutorial/Application/navContainer/controller/navContainer");
                                orientation.listGoNav();
                            }).catch(function(err) {
                                throw err.message;
                            })
                        }
                    }).catch(function(err) {
                        throw err.message;
                    })
                }).catch(function(err) {
                    throw err.message;
                })
            } else {
                var tokenLength = this.getView().byId("multiInput").getTokens().length;
                for (var j = 0; j < tokenLength; j++) {
                    var fullName = this.getView().byId("multiInput").getTokens()[j].mProperties.text;
                    var name = fullName.split(" ");
                    var nName = name[0];
                    var sName = name[1];
                    toObject = {
                        "id": parseInt(this.getView().byId("multiInput").getTokens()[j].mProperties.key),
                        "per_name": nName,
                        "per_surname": sName,
                        "roleTicket": "to"
                    };
                    pushArr.push(toObject);
                }
                oModel.setProperty("/saveInputTo", pushArr);
                if (JSON.stringify(oModel.getProperty("/saveToControl")) === JSON.stringify(oModel.getProperty("/saveInputTo"))) {
                    var ticket = oModel.getProperty("/ticket");
                    ticUp(ticket).then(function(res) {
                        var msg = 'Ticket güncellendi.';
                        MessageToast.show(msg);
                        that.inputsClean();
                        var orientation = sap.ui.controller("SapUI5Tutorial/Application/navContainer/controller/navContainer");
                        orientation.listGoNav();
                    }).catch(function(err) {
                        throw err;
                    })
                    oModel.setProperty("/saveInputTo", {});
                } else {
                    var fullName = oModel.getProperty("/ticket").from;
                    fullName = fullName.split(" ");
                    var name = fullName[0];
                    var surname = fullName[1];
                    var valueUsers = [];
                    var fromOb = {
                        "id": oModel.getProperty("/ticket").fromId,
                        "per_name": name,
                        "per_surname": surname,
                        "roleTicket": "from"
                    }
                    var newSaveInputTo = oModel.getProperty("/saveInputTo");
                    newSaveInputTo.push(fromOb);
                    ticUpToChange(ticket).then(function(res) {
                        updateDeleteRole(ticket.id).then(function(res) {
                            for (var i = 0; i < oModel.getProperty("/saveInputTo").length; i++) {
                                var us = JSON.stringify(oModel.getProperty("/saveInputTo")[i].id);
                                var ro = oModel.getProperty("/saveInputTo")[i].roleTicket;
                                updateInsertRole(us, ticket.id, ro).then(function(res) {
                                    var msg = 'Ticket güncellendi.';
                                    MessageToast.show(msg);
                                    oModel.setProperty("/saveInputTo", {});
                                    that.inputsClean();
                                    var orientation = sap.ui.controller("SapUI5Tutorial/Application/navContainer/controller/navContainer");
                                    orientation.listGoNav();
                                }).catch(function(err) {
                                    alert(err)
                                })
                            }
                        }).catch(function(err) {
                            alert(err)
                        })
                    }).catch(function(err) {
                        throw err;
                    })
                }
            }
        },
        dropClickTicket: function(oEvent) {
            var controlUrl = oModel.getProperty("/whereIsComing");
            deleteClickTicket(controlUrl).then(function(res) {
                deleteClickRole(controlUrl).then(function(res) {
                    var msg = 'Ticket silindi.';
                    MessageToast.show(msg);
                    that.inputsClean();
                    var orientation = sap.ui.controller("SapUI5Tutorial/Application/navContainer/controller/navContainer");
                    orientation.listGoNav();
                }).catch(function(err) {
                    alert(err)
                })
            }).catch(function(err) {
                alert(err)
            })
        },
    });
});