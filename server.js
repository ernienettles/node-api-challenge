const express = require('express');
const server = express();

const actionRouter = require('./routers/actionRouter')
const projectRouter = require('./routers/projectRouter')

function logger(req, res, next) {
  console.log(`[${new Date}] ${req.method} to ${req.url} from ${req.get('host')}`);
  next();
}

server.use(logger);
server.use(express.json())

server.use('/api/actions', actionRouter)
server.use('/api/projects', projectRouter)

module.exports = server;