import DataGridService from "../services/data-grid.service";
import { BaseController } from "./base.controller";
import { Request, ResponseToolkit } from "@hapi/hapi";

export class DataGridController extends BaseController {
  dataGridService!: DataGridService;
  constructor() {
    super();
    this.dataGridService = new DataGridService("dataGrid");
  }

  async dataSourceByPagination(request: Request, h: ResponseToolkit) {
    const { skip, take, sorting, filter } = request.query;
    console.log(request.url);
    console.log("skip and take");
    console.log(skip);
    console.log(take);

    try {
      const data = await this.dataGridService.pagination(
        Number(skip),
        Number(take)
      );

      return h.response({ success: true, data: data }).code(200);
    } catch (error) {
      return this.handleErrorResponse(error, h);
    }
  }
}
