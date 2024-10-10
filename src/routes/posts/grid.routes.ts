import { ResponseToolkit, ServerRoute, Request } from "@hapi/hapi";
import { DataGridController } from "../../controllers/datagrid.controller";
import Joi from "joi";

const gridController = new DataGridController();
export const gridRoutes: ServerRoute[] = [
  {
    path: "/api/grid/pagination",
    method: "GET",
    handler: (request: Request, h: ResponseToolkit) =>
      gridController.dataSourceByPagination(request, h),
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          take: Joi.string().required(),
          skip: Joi.string().required(),
        }),
      },
    },
  },
];
