sap.ui.define(['sap/ui/core/mvc/Controller'],

    function(Controller) {
        "use strict";
        var base = ""
        var that, navCon;
        return Controller.extend("SapUI5Tutorial.Application.navContainer.controller.navContainer", {
            onInit: function() {
                base = this;
                that = this;
                navCon = this.byId("navCon");
            },
            addGoNav: function(evt) {
                navCon.to(that.byId("p2"));
                oModel.setProperty("whereIsComing", "ADD");
                sap.ui.controller("SapUI5Tutorial.Application.ticketCreationPage.controller.ticketCreationPage").getTicket();
            },
            updateGoNav: function(wIC, evt) {
                navCon.to(that.byId("p2"));
                oModel.setProperty("whereIsComing", wIC);
                sap.ui.controller("SapUI5Tutorial.Application.ticketCreationPage.controller.ticketCreationPage").getTicket();
            },
            listGoNav: function(evt) {
                navCon.to(that.byId("p1"));
                oModel.setProperty("whereIsComing", {});
                sap.ui.controller("SapUI5Tutorial.Application.ticketListPage.controller.ticketListPage").letsStart();
            },
            onNavBack: function() {
                navCon.to(that.byId("p1"));
                oModel.setProperty("whereIsComing", {});
                sap.ui.controller("SapUI5Tutorial.Application.ticketListPage.controller.ticketListPage").letsStart();
                sap.ui.controller("SapUI5Tutorial.Application.ticketCreationPage.controller.ticketCreationPage").inputsClean();
            }
        });
    });