import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json());

/**
 * Global muatable data to update stream when log is passed
 */
let valueChanged = true;

/**
 * type of errors
 */
type typeOfLog = "error" | "info" | "warning" | "other"

/**
 * typeOfLogArray is declared to check that req value is valid type or not
 */
const typeOfLogArray: typeOfLog[] = ["error" , "info" , "warning" , "other"]


interface Client {
  /**
   * res is to store the response that is sent to client via streams
   */
  res: Response,
  /**
   * appId is to filter logs with accordance to log
   */
  appId: string
}

/**
 * LogsParams contain params to add logs to stream
 */
interface LogsParams {
  /**
   * app id to is to provide extra features to functionality
   */
  appid: string,
  /**
   * Contains core log 
   */
  log: string,
  /**
   * type of log for features on the frontend side
   */
  type: typeOfLog
}


/**
 * Core log
 */
interface Log {

  /**
   * app id to is to provide extra features to functionality
   */
  appid: string,

  /**
   * Contains core log 
   */
  log: string,
  timestamp: string

  /**
   * type of log for features on the frontend side
   */
  type: typeOfLog
}

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
  clients.forEach(({appId, res}) => {
    if (appId === appId) {
      res.write(`${JSON.stringify(responseData)}\n\n`);
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

  clients.push({appId: appid as string, res: res});

  req.on('close', () => {
    const index = clients.indexOf({appId: appid as string, res: res});
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
