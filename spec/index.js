require('dotenv').config({ path: './.env' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app/app');

chai.use(chaiHttp);
const testServer = chai.request(app).keepOpen();

global.request = testServer;
