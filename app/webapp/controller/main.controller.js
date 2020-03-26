sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/unified/CalendarLegendItem',
	'sap/ui/unified/DateTypeRange',
	'sap/ui/core/library',
	'healthcheckv2/healthcheckv2/model/formatter',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, CalendarLegendItem, DateTypeRange, coreLibrary, formatter, Filter, FilterOperator) {
	"use strict";
	var CalendarDayType = coreLibrary.CalendarDayType;
	const batchGroupId = "myUpdateGroupId";

	return Controller.extend("healthcheckv2.healthcheckv2.controller.main", {
		formatter: formatter,
		onInit: function () {
			var sUrl = "/svc/admin/";
			var oModel = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: sUrl,
				synchronizationMode: "None",
				operationMode: 'Server'
			});
			this.getView().setModel(oModel);
			oModel.getMetaModel().requestData().then(function (oEvent2) {
				console.log('oEvent2');

			});

			var userModel = new sap.ui.model.json.JSONModel();
			var that = this;
			userModel.attachRequestCompleted(function (oEvent) {
				// build filter array
				that.myid = oEvent.getSource().getProperty("/name");

				var f = new Filter("INumber", FilterOperator.EQ, that.myid);

				// filter binding
				var oCal1 = that.byId("calendar1");
				var oBinding = oCal1.getBinding("specialDates");
				oBinding.filter(f); //issue 1

			}, this);
			userModel.loadData("/getuserinfo");
			that.getView().setModel(userModel, "user");

			var oLeg1 = this.byId("legend1");
			oLeg1.addItem(new CalendarLegendItem({
				text: "健康",
				type: "Type07"
			}));
			oLeg1.addItem(new CalendarLegendItem({
				text: "发烧",
				type: "Type01"
			}));
			oLeg1.addItem(new CalendarLegendItem({
				text: "咳嗽",
				type: "Type02"
			}));
			var province = {
				"p": [{
					"v": "北京市"
				}, {
					"v": "天津市"
				}, {
					"v": "上海市"
				}, {
					"v": "重庆市"
				}, {
					"v": "河北省"
				}, {
					"v": "山西省"
				}, {
					"v": "辽宁省"
				}, {
					"v": "吉林省"
				}, {
					"v": "黑龙江省"
				}, {
					"v": "江苏省"
				}, {
					"v": "浙江省"
				}, {
					"v": "安徽省"
				}, {
					"v": "福建省"
				}, {
					"v": "江西省"
				}, {
					"v": "山东省"
				}, {
					"v": "河南省"
				}, {
					"v": "湖北省"
				}, {
					"v": "湖南省"
				}, {
					"v": "广东省"
				}, {
					"v": "海南省"
				}, {
					"v": "四川省"
				}, {
					"v": "贵州省"
				}, {
					"v": "云南省"
				}, {
					"v": "陕西省"
				}, {
					"v": "甘肃省"
				}, {
					"v": "青海省"
				}, {
					"v": "台湾省"
				}, {
					"v": "内蒙古自治区"
				}, {
					"v": "广西壮族自治区"
				}, {
					"v": "西藏自治区"
				}, {
					"v": "宁夏回族自治区"
				}, {
					"v": "新疆维吾尔自治区"
				}, {
					"v": "香港特别行政区"
				}, {
					"v": "澳门特别行政区"
				}, {
					"v": "国外"
				}]
			};
			var pro = new sap.ui.model.json.JSONModel();
			this.getView().setModel(pro, 'province');
			pro.setData(province);

			var statusModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(statusModel, 'form');
			this.formStatus = {
				status: false
			};
			statusModel.setData(this.formStatus);

		},
		getKey: function (d) {
			return "/HealthData('" + this.myid + d.wntoString() + "')";
		},
		getID: function (d) {
			return this.myid + d.wntoString();
		},
		bindEntry: function (d) {
			var key = this.getKey(d);
			var m = this.getView().getModel();
			m.resetChanges();
			var that = this;
			this.getView().byId('SimpleFormChange354').bindObject({
				path: key,
				events: {
					dataReceived: function (oEv) {
						if (oEv.mParameters["error"] === undefined) {
							that.getView().getModel('form').setProperty("/status", true);
						} else {
							if (d.compareDate(new Date())) { // is today
								var m = that.getView().getModel();
								var oListBinding = m.bindList('/HealthData');
								var oContext = oListBinding.create({
									"ID": that.getID(new Date()),
									"INumber": that.myid,
									"ReportDate": (new Date()).wntoString(),
									"Location": "北京",
									"Status": "健康",
									"Temperature": "",
									"hospitalize": false,
									"Travel": false,
									"Destination": "北京"
								});
								oContext.created().then(function() {
									that.created.refresh();
								});
								oListBinding.attachCreateCompleted(function(e) {
									console.log(e);
									that.created = e.getParameter('context');

									that.getView().byId('SimpleFormChange354').bindObject({
											path: e.getParameter('context').sPath
									});
								})
								// that.getView().byId('SimpleFormChange354').bindObject({
								// 	path: oContext.sPath,
								// 	events: {
								// 		dataReceived: function (oEv) {
								// 			console.log(oEv)
								// 		}
								// 	}
								// });
								that.getView().getModel('form').setProperty("/status", true);
								return;
							}
							that.getView().getModel('form').setProperty("/status", false);
						}
					}
				}
			});
			return;

		},
		onStatusChange: function(oo) {
			oo.getSource().getModel().refresh();
		},
		bindToView: function (d) {
			this.getView().byId('SimpleFormChange354').bindObject({
				path: this.getKey(d)
			});
			this.getView().getModel('status').setProperty("/status", true);
		},
		handleSelectDate: function (oEvent) {
			var oCal1 = this.byId("calendar1");
			var d = oCal1.getSelectedDates()[0].getStartDate();
			this.bindEntry(d);

		},
		buttonPress: function (e) {

			var m = this.getView().getModel();

			m.submitBatch('auto').then(function () {

				sap.m.MessageToast.show("数据创建成功，您已经成功打卡，祝身体健康！", {
					duration: 5000, // default
					width: "15em", // default
					my: "center bottom", // default
					at: "center bottom", // default
					of: window, // default
					offset: "0 0", // default
					collision: "fit fit", // default
					onClose: null, // default
					autoClose: true, // default
					animationTimingFunction: "ease", // default
					animationDuration: 1000, // default
					closeOnBrowserNavigation: true // default
				});
				m.refresh();
			});

		}
	});
});

Date.prototype.compareDate = function (d) {

	var r =
		d.getFullYear() === this.getFullYear() &&
		d.getMonth() === this.getMonth() &&
		d.getDate() === this.getDate();
	return r;
};

Date.prototype.wntoString = function () {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() + 1;
	mm = (mm < 10) ? "0" + mm : mm;
	var dd = this.getDate();
	dd = (dd < 10) ? "0" + dd : dd;
	return yyyy + '-' + mm + "-" + dd;
};