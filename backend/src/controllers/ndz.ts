/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { parsePilotQueryParams } from '../utils';
import { getAll } from '../db/pilotService';
const ndzmRouter = Router();

interface ReqQuery {
  date?: unknown;
  order?: unknown;
}

ndzmRouter.get('/', async (req, res) => {
  const params = parsePilotQueryParams(req.query as ReqQuery);
  const pilots = await getAll(params);
  return res.json(pilots);
});

export default ndzmRouter;