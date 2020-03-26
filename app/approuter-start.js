const approuter = require('@sap/approuter');
var ar = approuter();
ar.beforeRequestHandler.use('/getuserinfo', function (req, res, next) {
   if (!req.user) {
     res.statusCode = 403;
     res.end('Missing JWT Token');
   } else {
     res.statusCode = 200;
     res.setHeader("content-type","application/json");
     res.end(JSON.stringify(req.user));
   } 
});
ar.start();