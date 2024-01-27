import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import config from './server/config/config.js';
import routes from './server/routes/index.route.js';
import './server/config/mongoose.js';
const app = express();
const _dirname = path.resolve();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Cache-Control', `max-age=31536000, no-cache`);
    next();
});


app.use(compression());
// app.use(express.static(path.join(_dirname, distDir)))

app.use(bodyParser.json({ limit: '11mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '11mb' }));
app.use(cors());
app.use('/api/', routes);

app.listen(config.PORT, () => {
    console.info(`server started on port ${config.PORT}`);
});