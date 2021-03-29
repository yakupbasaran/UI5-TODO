'use strict'
jQuery.sap.require('SapUI5Tutorial.Router')
sap.ui.define(
    [
        'sap/ui/core/UIComponent',
        'sap/ui/model/json/JSONModel'
    ],
    function(UIComponent, JSONModel) {
        return UIComponent.extend('SapUI5Tutorial.Component', {
            metadata: {
                routing: {
                    config: {
                        routerClass: SapUI5Tutorial.Router,
                        viewType: 'XML',
                        targetAggregation: 'pages',
                        clearTarget: false
                    },
                    routes: [{
                            pattern: 'LoginPage',
                            viewPath: 'SapUI5Tutorial.Application.LoginPage.view',
                            name: 'LoginPage',
                            view: 'LoginPage',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'Dashboard',
                            viewPath: 'SapUI5Tutorial.Application.Dashboard.view',
                            name: 'Dashboard',
                            view: 'Dashboard',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'adminPage',
                            viewPath: 'SapUI5Tutorial.Application.adminPage.view',
                            name: 'adminPage',
                            view: 'adminPage',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'employeePage',
                            viewPath: 'SapUI5Tutorial.Application.employeePage.view',
                            name: 'employeePage',
                            view: 'employeePage',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'projectPage',
                            viewPath: 'SapUI5Tutorial.Application.projectPage.view',
                            name: 'projectPage',
                            view: 'projectPage',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'ticketListPage',
                            viewPath: 'SapUI5Tutorial.Application.ticketListPage.view',
                            name: 'ticketListPage',
                            view: 'ticketListPage',
                            targetControl: 'masterAppView'
                        },

                        {
                            pattern: 'ticketCreationPage?{param}',
                            viewPath: 'SapUI5Tutorial.Application.ticketCreationPage.view',
                            name: 'ticketCreationPage',
                            view: 'ticketCreationPage',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'login',
                            viewPath: 'SapUI5Tutorial.Application.login.view',
                            name: 'login',
                            view: 'login',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'ticket',
                            viewPath: 'SapUI5Tutorial.Application.ticket.view',
                            name: 'ticket',
                            view: 'ticket',
                            targetControl: 'masterAppView'
                        },
                        {
                            pattern: 'navContainer',
                            viewPath: 'SapUI5Tutorial.Application.navContainer.view',
                            name: 'navContainer',
                            view: 'navContainer',
                            targetControl: 'masterAppView'
                        }
                    ]
                }
            },
            init: function() {
                sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
                var mConfig = this.getMetadata().getConfig();
                this.getRouter().initialize();
            },
            createContent: function() {
                var oViewData = {
                    component: this
                }
                return sap.ui.view({
                    viewName: 'SapUI5Tutorial.RootApp',
                    type: sap.ui.core.mvc.ViewType.XML,
                    id: 'app',
                    viewData: oViewData
                })
            }
        })
    }
)