import { Response } from "express"

/**
 * type of errors
 */
export type typeOfLog = "error" | "info" | "warning" | "other"

/**
 * typeOfLogArray is declared to check that req value is valid type or not
 */
export const typeOfLogArray: typeOfLog[] = ["error" , "info" , "warning" , "other"]


export interface Client {
  /**
   * res is to store the response that is sent to client via streams
   */
  response: Response,
  /**
   * appId is to filter logs with accordance to log
   */
  appId: string
}

/**
 * LogsParams contain params to add logs to stream
 */
export interface LogsParams {
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
export interface Log {

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
