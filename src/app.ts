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
   * appId is to filter logs with arrodance to log
   */
  appId: string
}

interface UpdateArgs {
  appid: string,
  log: string,
  type: typeOfLog
}

interface Log {
  appid: string,
  log: string,
  timestamp: string
  type: typeOfLog
}

let clients: Client[] = [];


function sendUpdates(args: UpdateArgs) {
  
  const {appid, log} = args;

  const data = {
    appid: appid,
    log: log,
    time: new Date().toISOString()
  };

  clients.forEach(({appId, res}) => {
    if (appId === appId) {
      res.write(`${JSON.stringify(data)}\n\n`);
    }
  });

  valueChanged = false;
}

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

  res.write(`${JSON.stringify({ AppID: appid as string, connectionInfo: clientData })}\n\n`);

  clients.push({appId: appid as string, res: res});

  req.on('close', () => {
    const index = clients.indexOf({appId: appid as string, res: res});
    if (index !== -1) clients.splice(index, 1);
    res.end();
    console.log('Client disconnected');
  });
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy" });
});

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
