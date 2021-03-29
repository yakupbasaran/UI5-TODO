sap.ui.define([
    "sap/base/Log", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "sap/ui/table/RowAction", "sap/ui/table/RowActionItem", "sap/ui/table/RowSettings", "sap/ui/core/format/DateFormat", "sap/ui/thirdparty/jquery"
], function(Log, Controller, JSONModel, MessageToast, DateFormat, jQuery) {
    "use strict";
    var url = new URL("http://localhost:3000/#/ticketCreationPage");
    var string;
    var string = "";
    var stringTic = "";
    var that;
    return Controller.extend("SapUI5Tutorial.Application.ticketListPage.controller.ticketListPage", {
        onInit: function() {
            that = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("navContainer").attachPatternMatched(this.letsStart, this);
        },
        letsStart: function() {
            var tickets = [];
            var modelInfo = [];
            var userId = localStorage.getItem("userId");
            getTicketsForRoleTable(userId).then(function(res) {
                var tabLength = res.rows.length;
                that.getView().byId("tableView").setVisibleRowCount(tabLength);
            }).catch(function(err) {
                alert(err)
            })
            oModel.setProperty("/ticketInformations", {});
            var stringQuery;
            var stringQueryy;
            getTicketsForRoleTable(userId).then(function(res) {
                for (var i = 0; i < res.rows.length; i++) {
                    tickets.push(res.rows[i].ticketId);
                    var getTic = res.rows[i].ticketId;
                    string += ' id=' + getTic + ' OR';
                    stringTic += ' ticketId=' + getTic + ' OR';
                }
                stringQuery = string.slice(0, string.length - 3);
                stringQueryy = stringTic.slice(0, stringTic.length - 3);
                getTicketInfo(stringQueryy).then(function(results) {
                    var arrayTable = Object.assign([], results.rows);
                    for (var i = 0; i < tickets.length; i++) {
                        var ticVal = tickets[i];
                        var model = {};
                        var columnLen = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal && arrayTable.roleTicket == "to").length;
                        var toValues = [];
                        for (var j = 0; j < columnLen; j++) {
                            var toUserNames = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal && arrayTable.roleTicket == "to")[j].per_name + " " + arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal && arrayTable.roleTicket == "to")[j].per_surname;
                            toValues.push(toUserNames);
                        }
                        model.ticketId = ticVal;
                        model.project = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal)[0].project;
                        model.subject = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal)[0].subject;
                        model.startingDate = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal)[0].startingdate;
                        model.finishDate = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal)[0].finishdate;
                        model.status = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal)[0].ticketstatus;
                        model.from = arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal && arrayTable.roleTicket == "from")[0].per_name + " " + arrayTable.filter(arrayTable => arrayTable.ticketId == ticVal && arrayTable.roleTicket == "from")[0].per_surname;
                        modelInfo.push({
                            "project": model.project,
                            "subject": model.subject,
                            "ticketId": model.ticketId,
                            "startingdate": model.startingDate,
                            "finishdate": model.finishDate,
                            "status": model.status,
                            "from": model.from,
                            "to": toValues
                        });
                    }
                    oModel.setProperty("/ticketInformations", modelInfo);
                }).catch(function(err) {
                    alert(err)
                })
            }).catch(function(err) {
                alert(err)
            })
        },
        addTicketButton: function(evt) {
            oModel.setProperty("/whereIsComing", "ADD");
            var orientation = sap.ui.controller("SapUI5Tutorial/Application/navContainer/controller/navContainer");
            orientation.addGoNav("", that);
        },
        addProjectButton: function(evt) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("projectPage");
        },
        logPageButton: function() {
            localStorage.setItem("userName", "");
            localStorage.setItem("userId", "");
            localStorage.setItem("izin", "");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("LoginPage");
        },
        backPageButton: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("adminPage");
        },
        ContextMenu: function(oEvent) {
            if (oEvent.mParameters.item.mProperties.text == "Add") {
                that.addTicketButton();
            } else if (oEvent.mParameters.item.mProperties.text == "Update") {
                var clickInfo = oModel.getProperty(oEvent.getSource().getBindingContext().sPath);
                var clickInfoId = clickInfo.ticketId;
                localStorage.setItem("ticketClickInfo", clickInfoId);
                oModel.setProperty("/whereIsComing", clickInfoId);
                var wIC = oModel.getProperty("/whereIsComing");
                var orientation = sap.ui.controller("SapUI5Tutorial/Application/navContainer/controller/navContainer");
                orientation.updateGoNav(wIC, oEvent);
            } else if (oEvent.mParameters.item.mProperties.text == "Delete") {
                var clickInfo = oModel.getProperty(oEvent.getSource().getBindingContext().sPath);
                var clickInfoId = clickInfo.ticketId;
                localStorage.setItem("ticketClickInfo", clickInfoId);
                oModel.setProperty("/whereIsComing", clickInfoId);
                var orientation = sap.ui.controller("SapUI5Tutorial/Application/ticketCreationPage/controller/ticketCreationPage");
                orientation.dropClickTicket(oEvent);
            }
        },
    });
});