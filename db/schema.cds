namespace sap.nanwang.healthcheck;
using { Currency, managed } from '@sap/cds/common';

entity OChart  {
  key PersonnelNumber   : String(16);
  UserID    : String(16);
  Lastname    : String(16);
  Firstname    : String(16);
  OChartDesc    : String(64);
  Manager    : String(16);
  ManagerFullName    : String(32);
  BaseCity    : String(32);
  EMail    : String(32);
}

entity HealthData : managed {
  
  key ID : String(48);
  INumber     : String(32);
  ReportDate     : Date;
  Location     : String(16);
  Status     : String(16);
  Temperature     : String(16);
  hospitalize     : Boolean;
  Travel     : Boolean;
  Destination     : String(16);
}

entity Report1 as select from HealthData left join OChart on OChart.UserID = HealthData.INumber 
{ 
	key HealthData.ID,
	OChart.PersonnelNumber, 
	HealthData.INumber, 
	OChart.Firstname, 
	OChart.Lastname, 
	HealthData.ReportDate, 
	HealthData.Location, 
	HealthData.Status, 
	HealthData.Temperature, 
	HealthData.hospitalize, 
	HealthData.Travel, 
	HealthData.Destination, 
	OChart.Manager, 
	ManagerFullName 
};