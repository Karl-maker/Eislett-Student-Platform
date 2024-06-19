import express from 'express';
import config from '../../config';
import logger from '../../application/services/log';
import router from './routes/v1.routes';
import errorHandler from './middlewares/error.handler.middleware';
import httpLogger from './middlewares/http.logging.middleware';


const app = express();
const PORT = config.system.PORT

app.use(express.json());
app.use(httpLogger);

app.use('/api/v1', router);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`server started on port ${PORT}`);
});