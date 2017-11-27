const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const router = require('./router');
const auth = require('./services/auth.service');


const app = express();

app.set('port', config.web.port);

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
auth.init(app);

router.init(app);


app.listen(app.get('port'), () => {
  console.log(`Server has been started on port ${app.get('port')}`);
});
