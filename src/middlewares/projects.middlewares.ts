import { NextFunction, Request, Response } from "express";
import {
  IProjects,
  ITechnologies,
  TTechnologiesRequest,
} from "../interfaces/projects.interfaces";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { IInsertTechology } from "../interfaces/projects.interfaces";

const ensureNameTechnologiesExistsMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let { name }: TTechnologiesRequest = req.body;

  if (req.route.path === "/projects/:id/technologies/:name") {
    name = req.params.name;
  }

  const queryString: string = `
      SELECT
        *
      FROM
        technologies
      WHERE
        name = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult<ITechnologies> = await client.query(
    queryConfig
  );

  if (!queryResult.rowCount) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  } else {
    const idTechnology = queryResult.rows[0].id;
    res.locals.technologyId = idTechnology;
  }

  return next();
};

const ensureProjectExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const idProject: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
        *
    FROM
        projects
    WHERE 
    id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idProject],
  };

  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Project not found." });
  }

  return next();
};

const ensureTechnologyExistsProjectMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const idProject: number = parseInt(req.params.id);
  const idTechnology: string = res.locals.technologyId;

  const queryString: string = `
    SELECT
        *
    FROM 
        projects_technologies projtech
    WHERE 
        projtech."technologyId" = $1 AND projtech."projectId" = $2;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idTechnology, idProject],
  };

  const queryResult: QueryResult<IInsertTechology> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount) {
    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};

export {
  ensureNameTechnologiesExistsMiddlewares,
  ensureProjectExistsMiddleware,
  ensureTechnologyExistsProjectMiddlewares,
};
