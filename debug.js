// ===================================================
// FOR DEVELOPMENT
// Total.js - framework for Node.js platform
// https://www.totaljs.com
// ===================================================

const options = {};

options.ip = process.env.IP || "0.0.0.0";
options.port = process.env.PORT || 3000;
// options.config = { name: 'Total.js' };
// options.sleep = 3000;
// options.inspector = 9229;
// options.debugger = 40894;

require('total.js/debug')(options);