sap.ui.define([
    'sap/m/MessageToast',
    "sap/ui/core/mvc/Controller"
], function(MessageToast, Controller) {
    "use strict";
    var oRouter, that;
    return Controller.extend("SapUI5Tutorial.Application.LoginPage.controller.LoginPage", {
        onInit: function() {
            oModel.setProperty("/loginInformations", {});
            that = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("LoginPage").attachPatternMatched(this.startLogin, this);
        },
        startLogin: function() {
            var model = oModel.getProperty("/loginInformations");
            oModel.setProperty("/loginInformations", {});
        },
        login: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var model = oModel.getProperty("/loginInformations");
            if (oModel.getProperty("/loginInformations").password == undefined || oModel.getProperty("/loginInformations").password == "" || oModel.getProperty("/loginInformations").email == "" || oModel.getProperty("/loginInformations").email == undefined) {
                MessageToast.show("Boş bırakmayınız.(Do not leave blank.)");
            } else {
                getTable().then(function(res) {
                    nameSurname(oModel.getProperty("/loginInformations")).then(function(res) {
                        var userName = res.rows[0].per_name;
                        var userSurname = res.rows[0].per_surname;
                        var userFullName = userName + " " + userSurname;
                        var userId = res.rows[0].id;
                        if (res.rows[0].role == 1) {
                            localStorage.setItem("userName", userFullName);
                            localStorage.setItem("userId", userId);
                            localStorage.setItem("izin", true);
                            oRouter.navTo("adminPage");
                        } else {
                            localStorage.setItem("userName", userFullName);
                            localStorage.setItem("userId", userId);
                            localStorage.setItem("izin", false);
                            oRouter.navTo("adminPage");
                        }
                    }).catch(function(err) {
                        MessageToast.show("Yanlış veya eksik bir kelime tuşladınız.(You entered an incorrect or incomplete word.)");
                        that.getView().byId("inputPassword").setValue("");
                    })
                }).catch(function(err) {
                    alert(err)
                })
            }
        }
    })
})