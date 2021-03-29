sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    var id, guide, img, employees, that, array = [];
    return Controller.extend("SapUI5Tutorial.Application.adminPage.controller.adminPage", {
        onInit: function() {
            that = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("adminPage").attachPatternMatched(this.startingFunctions, this);
        },
        startingFunctions: function() {
            if (localStorage.getItem("izin") == "true") {
                oModel.setProperty("/permission", true);
                that.byId("save").setVisible(true);
                that.byId("update").setVisible(false);
                that.byId("delete").setVisible(false);
                that.getPersons();
            } else if (localStorage.getItem("izin") == "false") {
                oModel.setProperty("/permission", false);
                that.byId("inputs").setVisible(false);
                that.getPersons();
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                MessageToast.show("YETKİNİZ BULUNMAMAKTADIR!");
                oRouter.navTo("LoginPage");
            }
        },
        getPersons: function() {
            oModel.setProperty("/informations", {});
            oModel.setProperty("/information", {});
            that.byId("fileUploader").setValue(null);
            var array = [];
            getTable().then(function(res) {
                var model = {};
                model = Object.assign([], res.rows);
                oModel.setProperty("/informations", model);
            }).catch(function(err) {
                throw err.message;
            })
        },
        onChange: function(oEvent) {
            var aFiles = oEvent.getParameters().files;
            var currentFile = aFiles[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                img = e.target.result;
            };
            reader.readAsDataURL(currentFile);
        },
        save: function() {
            var model2 = oModel.getProperty("/information");
            if (model2.per_name != undefined && model2.per_surname != undefined && model2.per_email != undefined) {
                var persons = oModel.getProperty("/informations");
                var foto = img;
                model2.per_password = "123456";
                var count = 0;
                emailControl().then(function(res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (model2.per_email == res.rows[i].per_email) {
                            count = 1;
                            MessageToast.show("Girmiş olduğunuz e-posta zaten var.");
                            that.getView().byId("passwordInput").setEnabled(false);
                            oModel.setProperty("/information", {});
                            that.inputsClean();
                        }
                    }
                    if (count == 0) {
                        addEmployee(model2, foto).then(function(res) {
                            model2 = {};
                            getTable().then(function(res) {
                                oModel.setProperty("/informations", Object.assign([], res.rows));
                                oModel.setProperty("/information", {});
                                that.byId("fileUploader").setValue(null);
                                that.getView().byId("passwordInput").setEnabled(false);
                            }).catch(function(err) {
                                throw err.message;
                            })
                        }).catch(function(err) {
                            throw err.message;
                        })
                    }
                }).catch(function(err) {
                    throw err.message;
                })
            } else {
                MessageToast.show("Boş alanları doldurunuz.");
                oModel.setProperty("/information", {});
                that.getView().byId("passwordInput").setEnabled(false);
            }
        },
        onSelect: function(oEvent) {
            that.getView().byId("passwordInput").setEnabled(true);
            that.getView().byId("guList").removeSelections(true);
            var selectedPersonPath = oEvent.mParameters.listItem.getBindingContextPath();
            var selectPerson = JSON.parse(JSON.stringify(oModel.getProperty(selectedPersonPath)));
            id = selectPerson.id;
            selectPerson.per_img = oModel.getProperty(selectedPersonPath).per_img;
            oModel.setProperty("/information", selectPerson);
            that.getView().byId("update").setVisible(true);
            that.getView().byId("delete").setVisible(true);
            that.getView().byId("save").setVisible(false);
            if (localStorage.getItem("inputVisibility") == "false") {
                that.getView().byId("update").setVisible(false);
                that.getView().byId("delete").setVisible(false);
            }
        },
        update: function() {
            var getInputId = oModel.getProperty("/information").id;
            var person = oModel.oData.informations.find(x => x.id == getInputId)
            if (oModel.getProperty("/information").per_email == person.per_email) {
                guide = oModel.getProperty("/informations");
                var inputValues = oModel.getProperty("/information");
                var filterGuide = guide.find(filt => filt.id == id);
                updateEmployee(inputValues, filterGuide, img).then(function(res) {}).catch(function(err) {
                    throw err.message;
                })
                filterGuide.per_name = inputValues.per_name;
                filterGuide.per_surname = inputValues.per_surname;
                filterGuide.per_email = inputValues.per_email;
                filterGuide.per_password = inputValues.per_password;
                filterGuide.photo = oModel.getProperty("/information").per_img;
                oModel.setProperty("/information", {});
                that.getView().byId("passwordInput").setEnabled(false);
                that.saveOpen();
                that.getPersons();
            } else {
                getTable().then(function(res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (oModel.getProperty("/information").per_email == res.rows[i].per_email) {
                            MessageToast.show("Girmiş olduğunuz e-posta zaten var.");
                            that.inputsClean();
                            that.getPersons();
                        }
                    }
                    guide = oModel.getProperty("/informations");
                    var inputValues = oModel.getProperty("/information");
                    var filterGuide = guide.find(filt => filt.id == id);
                    updateEmployee(inputValues, filterGuide, img).then(function(res) {}).catch(function(err) {
                        throw err.message;
                    })
                    filterGuide.per_name = inputValues.per_name;
                    filterGuide.per_surname = inputValues.per_surname;
                    filterGuide.per_email = inputValues.per_email;
                    filterGuide.per_password = inputValues.per_password;
                    filterGuide.photo = oModel.getProperty("/information").per_img;
                    oModel.setProperty("/information", {});
                    that.getView().byId("passwordInput").setEnabled(false);
                    that.saveOpen();
                    that.getPersons();
                }).catch(function(err) {
                    throw err.message;
                })
            }
        },
        delete: function() {
            employees = oModel.getProperty("/informations");
            var selectedEmployee = employees.find(filt => filt.id == id);
            deleteEmployee(selectedEmployee).then(function(res) {
                deleteEmployeeRole(selectedEmployee.id).then(function(res) {
                    that.getView().byId("passwordInput").setEnabled(true);
                    that.getPersons();
                }).catch(function(err) {
                    throw err.message;
                })
            }).catch(function(err) {
                throw err.message;
            })
            that.saveOpen();
            that.inputsClean();
        },
        inputsClean: function() {
            that.getView().byId("nameInput").setValue(null);
            that.getView().byId("surnameInput").setValue(null);
            that.getView().byId("emailInput").setValue(null);
            that.getView().byId("passwordInput").setValue(null);
            that.getView().byId("fileUploader").setValue(null);
        },
        saveOpen: function() {
            that.getView().byId("update").setVisible(false);
            that.getView().byId("delete").setVisible(false);
            that.getView().byId("save").setVisible(true);
        },
        logout: function() {
            oModel.setProperty("/informations", {});
            array = [];
            localStorage.clear();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("LoginPage");
        },
        projectList: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("projectPage");
        },
        gooTicketListButton: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("navContainer");
        }
    })
})