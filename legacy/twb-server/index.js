const dotenv = require("dotenv");
dotenv.config();
const app = require('express')();
const port = process.env.APP_PORT || 3001;
const helmet = require("helmet");
const setEnvironment = require('./config/env');
const registerRoutes = require('./router');
const setupSokcetIo = require('./config/socketio');
//? When needed
// const CronJobs = require("./utilities/cronjobs");

setEnvironment(app);
registerRoutes(app);

//? When needed
// CronJobs.AnyDefined.start();

app.get('/api', (req, res) => {
  return res.send('Running server in development mode.');
  // if (process.env.NODE_ENV !== 'production') {
  //   return res.send('Running server in development mode.');
  // } else {
  //   return res.sendFile('index.html', { root: __dirname + '/../dist/' });
  // }
});

//? To secure app by setting HTTP response headers
app.use(helmet.hidePoweredBy())
app.use(
  helmet({
    contentSecurityPolicy: false,
    dnsPrefetchControl: {
      allow: false,
    },
    expectCt: {
      enforce: true,
      maxAge: 30,
    },
    frameguard: {
      action: "deny",
    },
    //! Enable in production to ensure connectivity through only https
    // hsts: {
    //   maxAge: 5184000,
    //   includeSubDomains: true,
    //   preload: true,
    // },
    noSniff: true,
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
    xssFilter: true,
  })
);

const server = app.listen(port, () => {
  console.log(`Tamil Book server app is listening on port ${port}`)
});

setupSokcetIo(server);
