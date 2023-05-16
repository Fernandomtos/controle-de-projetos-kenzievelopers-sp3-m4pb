import { Request, Response } from "express";
import {
  IInsertTechology,
  IProjects,
  IProjectsList,
  TInsertTechologyRequest,
  TProjectRequest,
  TProjectTechnology,
} from "../interfaces/projects.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectsData: TProjectRequest = req.body;

  if (!projectsData.endDate) {
    projectsData.endDate = null;
  }

  const queryString: string = format(
    `
        INSERT INTO
            projects (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(projectsData),
    Object.values(projectsData)
  );

  const queryResult: QueryResult = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const listProjectsDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT 
      proj."id" "projectId",
      proj."name" "projectName",
      proj."description" "projectDescription",
      proj."estimatedTime" "projectEstimatedTime",
      proj."repository" "projectRepository",
      proj."startDate" "projectStartDate",
      proj."endDate" "projectEndDate",
      proj."developerId" "projectDeveloperId",
      techProj."technologyId" "technologyId",
      tech."name" "technologyName"
    FROM 
      projects proj
    LEFT JOIN
      projects_technologies techProj ON proj."id" = techProj."projectId"
    LEFT JOIN 
    technologies tech ON tech."id" = techproj."technologyId"
    WHERE
      proj."id" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProjectsList> = await client.query(
    queryConfig
  );

  return res.status(200).json(queryResult.rows);
};

const insertTechnologyProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const idProject: number = parseInt(req.params.id);
  const nameTech: string = req.body.name;

  const addedInDate = new Date();

  const technologiesData: TInsertTechologyRequest = {
    addedIn: addedInDate,
    technologyId: res.locals.technologyId,
    projectId: idProject,
  };

  const queryInsert: string = format(
    `
    INSERT INTO
      projects_technologies (%I)
    VALUES
      (%L)
    RETURNING *;
  `,
    Object.keys(technologiesData),
    Object.values(technologiesData)
  );

  const queryResultInsert: QueryResult<IInsertTechology> = await client.query(
    queryInsert
  );

  const queryString: string = `
    SELECT 
      techProj."technologyId" "technologyId",
      tech."name" "technologyName",
      proj."id" "projectId",
      proj."name" "projectName",
      proj."description" "projectDescription",
      proj."estimatedTime" "projectEstimatedTime",
      proj."repository" "projectRepository",
      proj."startDate" "projectStartDate",
      proj."endDate" "projectEndDate"    
    FROM 
      projects proj
    LEFT JOIN
      projects_technologies techProj ON proj."id" = techProj."projectId"
    LEFT JOIN 
      technologies tech ON tech."id" = techproj."technologyId"
    WHERE
      proj."id" = $1 AND tech."name" = $2;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idProject, nameTech],
  };

  const queryResult: QueryResult<TProjectTechnology> = await client.query(
    queryConfig
  );

  return res.status(201).json(queryResult.rows[0]);
};

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: Partial<TProjectRequest> = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
    UPDATE
      projects
      SET(%I) = ROW(%L)
    WHERE
    id = $1
    RETURNING *;
  `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE
      FROM
      projects
    WHERE
    id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);
  return res.status(204).send();
};

const deleteTechnologyProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const idProject: number = parseInt(req.params.id);
  const idTechnology: string = res.locals.technologyId;

  const queryString: string = `
  DELETE
    FROM
    projects_technologies projtech
  WHERE
    projtech."projectId" = $1 AND projtech."technologyId" = $2;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idProject, idTechnology],
  };

  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res
      .status(400)
      .json({ message: "Technology not related to the project." });
  }

  return res.status(204).send();
};

export {
  createProjects,
  insertTechnologyProject,
  listProjectsDeveloper,
  updateProject,
  deleteProject,
  deleteTechnologyProject,
};
