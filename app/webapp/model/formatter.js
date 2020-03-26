sap.ui.define([], function () {
	"use strict";
	return {
		statusVisible: function (sStatus) {
			if (sStatus === "健康")
				return false;
			else
				return true;
		},
		specialDate: function (sData) {
			var dd = sData.split('-');
			var d = new Date(dd[0], dd[1] - 1, dd[2]);
			return d;
		},
		specialDateType: function (sData) {
			switch (sData) {
				case "健康":
					return "Type07";
				case "发烧":
					return "Type01";
				case "咳嗽":
					return "Type02";
				default:
					return "None";
			}
		},
		buttonEnabled: function (sData) {
			if (sData !== null && sData !== undefined)
				return (new Date(sData)).compareDate(new Date());
			return true;
		},
		ReportDateString: function (d) {
			return d;
		},
		shortName: function (d) {
			if (d !== undefined)
				return d.substr(0, d.indexOf('@'));
		}
	};
});