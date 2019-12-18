import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import mongoose from 'mongoose';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.mongoose();
    this.exceptionHandlers();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    // this.server.use(cors({origin: 'http://dominio do seu site.com.br'})); // ao colocar online tem q ser assim por exemplo
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  mongoose() {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }

  exceptionHandlers() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'dev') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json('Internal Server Error');
    });
  }
}

export default new App().server;
