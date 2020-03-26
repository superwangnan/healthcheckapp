using { sap.nanwang.healthcheck as my } from '../db/schema';
service AdminService @(requires:'admin') {
  entity OChart as projection on my.OChart;
  entity HealthData as projection on my.HealthData;
  entity Report1 as projection on my.Report1;
}