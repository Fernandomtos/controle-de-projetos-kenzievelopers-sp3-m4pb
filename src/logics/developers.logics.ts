import { Request, Response } from "express";
import {
  IDeveloper,
  IDeveloperInfo,
  IDeveloperList,
  TDeveloperInfoRequest,
  TDeveloperRequest,
} from "../interfaces/developers.interfaces";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import format from "pg-format";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDeveloperRequest = req.body;

  const queryString: string = format(
    `
    INSERT INTO
        developers (%I)
    VALUES
        (%L)
    RETURNING *;  
  `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<IDeveloper> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const createDeveloperInfos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerInfosData: TDeveloperInfoRequest = req.body;
  developerInfosData.developerId = parseInt(req.params.id);

  if (
    developerInfosData.preferredOS === "MacOS" ||
    developerInfosData.preferredOS === "Linux" ||
    developerInfosData.preferredOS === "Windows"
  ) {
    const queryString: string = format(
      `
      INSERT INTO
          developer_infos (%I)
      VALUES
          (%L)
      RETURNING *;
    `,
      Object.keys(developerInfosData),
      Object.values(developerInfosData)
    );

    const queryResult: QueryResult<IDeveloperInfo> = await client.query(
      queryString
    );

    return res.status(201).json(queryResult.rows[0]);
  } else {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }
};

const listDeveloperId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
        SELECT 
            dev."id" "developerId",
            dev."name" "developerName",
            dev."email" "developerEmail",
            devInfo."developerSince" "developerInfoDeveloperSince",
            devInfo."preferredOS" "developerInfoPreferredOS"  
        FROM 
            developers dev
        LEFT JOIN
            developer_infos devInfo ON dev."id" = devinfo."developerId"
        WHERE 
            dev."id" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloperList> = await client.query(
    queryConfig
  );

  return res.status(200).json(queryResult.rows[0]);
};

const updateDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: Partial<TDeveloperRequest> = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
    UPDATE
      developers
      SET(%I) = ROW(%L)
    WHERE
      id = $1
    RETURNING *;
  `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE
      FROM 
    developers
      WHERE
    id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  return res.status(204).send();
};

export {
  createDeveloper,
  createDeveloperInfos,
  listDeveloperId,
  updateDevelopers,
  deleteDeveloper,
};
