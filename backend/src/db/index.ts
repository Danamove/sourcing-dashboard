import knex from 'knex';
import knexConfig from './knexfile.js';
import { config } from '../config/index.js';

const environment = config.nodeEnv || 'development';
export const db = knex(knexConfig[environment]);
