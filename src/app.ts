import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createDeveloperInfos,
  deleteDeveloper,
  listDeveloperId,
  updateDevelopers,
} from "./logics/developers.logics";
import {
  ensureDeveloperExistsMiddleware,
  ensureDeveloperInfosExistsMiddleware,
  ensureEmailDeveloperExistsMiddlewares,
} from "./middlewares/developers.middlewares";
import {
  createProjects,
  deleteProject,
  deleteTechnologyProject,
  insertTechnologyProject,
  listProjectsDeveloper,
  updateProject,
} from "./logics/projects.logics";
import {
  ensureNameTechnologiesExistsMiddlewares,
  ensureProjectExistsMiddleware,
  ensureTechnologyExistsProjectMiddlewares,
} from "./middlewares/projects.middlewares";

const app: Application = express();

app.use(express.json());

app.post("/developers", ensureEmailDeveloperExistsMiddlewares, createDeveloper);
app.post(
  "/developers/:id/infos",
  ensureDeveloperExistsMiddleware,
  ensureDeveloperInfosExistsMiddleware,
  createDeveloperInfos
);
app.get("/developers/:id", ensureDeveloperExistsMiddleware, listDeveloperId);
app.patch(
  "/developers/:id",
  ensureDeveloperExistsMiddleware,
  ensureEmailDeveloperExistsMiddlewares,
  updateDevelopers
);
app.delete("/developers/:id", ensureDeveloperExistsMiddleware, deleteDeveloper);

app.post("/projects", ensureDeveloperExistsMiddleware, createProjects);
app.post(
  "/projects/:id/technologies",
  ensureProjectExistsMiddleware,
  ensureNameTechnologiesExistsMiddlewares,
  ensureTechnologyExistsProjectMiddlewares,
  insertTechnologyProject
);
app.get("/projects/:id", ensureProjectExistsMiddleware, listProjectsDeveloper);
app.patch(
  "/projects/:id",
  ensureProjectExistsMiddleware,
  ensureDeveloperExistsMiddleware,
  updateProject
);
app.delete("/projects/:id", ensureProjectExistsMiddleware, deleteProject);
app.delete(
  "/projects/:id/technologies/:name",
  ensureProjectExistsMiddleware,
  ensureNameTechnologiesExistsMiddlewares,
  deleteTechnologyProject
);

export default app;
