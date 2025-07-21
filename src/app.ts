import express, { Request, Response } from 'express';
import cors from 'cors';
import { Client, Log, LogsParams, typeOfLogArray } from './types';
import dotenv from "dotenv"


dotenv.config()

if (!process.env.PORT) {
  console.log("ENV Error: Failed to get env value of PORT");
  process.exit(0)
}

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

/**
 * Global muatable data to update stream when log is passed
 */
let valueChanged = true;


/**
 * clients array contain the connected clients
 */
let clients: Client[] = [];


/**
 * Contains core logic to filter logs, create logs
 * @param {LogsParams} args necessary data required to update the stream
 */
function sendUpdates(args: LogsParams): void {
  
  const {appid, log, type} = args;

  const responseData: Log = {
    appid: appid,
    log: log,
    type: type,
    timestamp: new Date().toISOString(),
  };

  /**
   * Filter out logs with provided appId
   */
  clients.forEach(({appId, response}) => {
    if (appId === appId) {
      response.write(`${JSON.stringify(responseData)}\n\n`);
    }
  });

  valueChanged = false;
}

/**
 * Events stream endpoint
 */
app.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { appid } = req.query;

  if (!appid) {
    res.status(400).json({message: "All fields are required "})
  }

  const clientData = {
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress ,
    browser: req.headers['user-agent']
  }

  /**
   * Returns back basic details
   */
  res.write(`${JSON.stringify({ AppID: appid as string, connectionInfo: clientData })}\n\n`);

  clients.push({appId: appid as string, response: res});

  req.on('close', () => {
    const index = clients.indexOf({appId: appid as string, response: res});
    if (index !== -1) clients.splice(index, 1);
    res.end();
    console.log('Client disconnected');
  });
});

/**
 * To check health
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy" });
});

/**
 * To write logs which can be streamed
 */
app.post('/write', (req: Request, res: Response) => {
  const { log, logtype } = req.body;
  const { appid } = req.query;

  if (!log || !logtype ||!appid) {
    res.status(400).json({message: "All the fields are required !"})
    return
  }

  valueChanged = true;

  if (typeOfLogArray.includes(logtype)) {
    sendUpdates({appid: appid as string, log, type: logtype}); 
  } else {
    sendUpdates({appid: appid as string, log, type: "other"}); 
  } 

  res.status(202).json({sucess: true});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
