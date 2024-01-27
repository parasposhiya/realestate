import { set, connect } from 'mongoose';
import config from './config.js';

try {

  set('strictQuery', false);
  connect(config.MONGOHOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    compressors: ["zstd"],
    autoIndex: false,
    autoCreate: false
  });

} catch (e) {
  throw new Error(`unable to connect to database: ${config.MONGOHOST} -- ${e}`);
}
