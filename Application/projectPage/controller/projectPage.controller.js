sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/core/Core", "sap/ui/layout/HorizontalLayout", "sap/ui/layout/VerticalLayout", "sap/m/Dialog", "sap/m/DialogType", "sap/m/Button", "sap/m/ButtonType", "sap/m/Label", "sap/m/MessageToast", "sap/m/Text", "sap/m/TextArea"
], function(Controller, Core, HorizontalLayout, VerticalLayout, Dialog, DialogType, Button, ButtonType, Label, MessageToast, Text, TextArea) {
    "use strict";
    var model, selectedProjectPath, that;
    var array = [];
    return Controller.extend("SapUI5Tutorial.Application.projectPage.controller.projectPage", {
        onInit: function() {
            that = this;
            oModel.setProperty("/projects", {});
            model = oModel.getProperty("/projects");
            getValues().then(function(res) {
                oModel.setProperty("/projects", Object.assign([], res.rows));
            }).catch(function(err) {
                throw err.message;
            })
        },
        onRejectDialogPress: function(oEvent, id, tit) {
            if (!this.oRejectDialog) {
                this.oRejectDialog = {
                    id: id,
                    tit: tit,
                };
                this.oRejectDialog = new Dialog({
                    title: "Reject",
                    type: DialogType.Message,
                    content: [
                        new Label("label", {
                            text: "",
                            labelFor: "rejectionNote",
                        }),
                        new sap.m.Input("rejectionNote", {
                            width: "100%",
                            value: oEvent.getSource().data("param") === "addButtonsVisible" ? "" : oModel.getProperty("/selectedProject/pro_title"),
                            placeholder: "Add note (optional)"
                        }),
                        new Button("guncelle", {
                            type: ButtonType.Emphasized,
                            text: "Update",
                            visible: oEvent.getSource().data("param") === "addButtonsVisible" ? false : true,
                            press: function() {
                                var con = Core.byId("rejectionNote").getValue();
                                updateProDialog(con, oModel.getProperty("/selectedProject").id).then(function(res) {
                                    model = oModel.getProperty("/projects");
                                    var filtModel = model.find(b => b.id == oModel.getProperty("/selectedProject").id);
                                    filtModel.pro_title = con;
                                    oModel.refresh();
                                    Core.byId("rejectionNote").setValue("");
                                }).catch(function(err) {
                                    throw err.message;
                                })
                                this.oRejectDialog.close();
                            }.bind(this)
                        }),
                        new Button("sil", {
                            text: "Delete",
                            visible: oEvent.getSource().data("param") === "addButtonsVisible" ? false : true,
                            press: function(model) {
                                deleteProDialog(oModel.getProperty("/selectedProject").id).then(function(res) {
                                    var deletedModel = oModel.getProperty("/projects");
                                    var notFiltModel = deletedModel.filter(b => b.id != oModel.getProperty("/selectedProject").id);
                                    oModel.setProperty("/projects", notFiltModel);
                                    array = notFiltModel;
                                    oModel.refresh(true);
                                    that.oRejectDialog.destroy();
                                    oModel.setProperty("/selectedProject", {});
                                    that.oRejectDialog = undefined;
                                }).catch(function(err) {
                                    throw err.message;
                                })
                                this.oRejectDialog.close();
                            }.bind(this)
                        })
                    ],
                    beginButton: new Button("ekle", {
                        type: ButtonType.Emphasized,
                        text: "Add",
                        visible: oEvent.getSource().data("param") === "addButtonsVisible" ? true : false,
                        press: function() {
                            var sText = Core.byId("rejectionNote").getValue();
                            MessageToast.show("Project is: " + sText);
                            addProject(sText).then(function(res) {
                                getValues().then(function(res) {
                                    oModel.setProperty("/projects", Object.assign([], res.rows));
                                    Core.byId("rejectionNote").setValue("");
                                }).catch(function(err) {
                                    throw err.message;
                                })
                            }).catch(function(err) {
                                throw err.message;
                            })
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function() {
                            this.oRejectDialog.destroy();
                            oModel.setProperty("/selectedProject", {});
                            this.oRejectDialog = undefined;
                        }.bind(this)
                    })
                });
            }
            this.oRejectDialog.open();
        },
        onClick: function(oEvent) {
            selectedProjectPath = oEvent.getSource().getBindingContextPath();
            var selectProject = JSON.parse(JSON.stringify(oModel.getProperty(selectedProjectPath)));
            oModel.setProperty("/selectedProject", selectProject);
            var id = selectProject.id;
            var tit = selectProject.pro_title;
            this.onRejectDialogPress(oEvent, id, tit);
        },
        goTicketPage: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("navContainer");
        },
        goAdminPage: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("adminPage");
        }
    })
})