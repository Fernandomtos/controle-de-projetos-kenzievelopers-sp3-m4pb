import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import {
  IDeveloper,
  TDeveloperRequest,
} from "../interfaces/developers.interfaces";

const ensureDeveloperExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  // if (req.route.path === "/projects" && req.method === "POST") ------ DELETAR DEPOIS
  if (req.route.path === "/projects" || req.route.path === "/projects/:id") {
    id = req.body.developerId;
  }

  const queryString: string = `
    SELECT 
        *
    FROM
        developers
    WHERE id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Developer not found." });
  }

  return next();
};

const ensureEmailDeveloperExistsMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email }: TDeveloperRequest = req.body;

  const queryString: string = `
    SELECT
      *
    FROM
      developers
    WHERE
      email = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({ message: "Email already exists." });
  }

  return next();
};

const ensureDeveloperInfosExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
      *
    FROM
      developer_infos
    WHERE 
      "developerId" = $1; 
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({ message: "Developer infos already exists." });
  }

  return next();
};

export {
  ensureDeveloperExistsMiddleware,
  ensureEmailDeveloperExistsMiddlewares,
  ensureDeveloperInfosExistsMiddleware,
};
