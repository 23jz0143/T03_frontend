import type { DataProvider } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { listBaseUrl } from "./constants";

import { getList } from "./methods/getList";
import { getOne } from "./methods/getOne";
import { getMany } from "./methods/getMany";
import { getManyReference } from "./methods/getManyReference";
import { create } from "./methods/create";
import { update } from "./methods/update";
import { deleteOne } from "./methods/delete";
import { deleteMany } from "./methods/deleteMany";

const baseProvider = jsonServerProvider(listBaseUrl);

export const customDataProvider: DataProvider = {
  ...baseProvider,

  getList: (resource, params) => getList(resource, params),
  getOne: (resource, params) => getOne(resource, params),
  getMany: (resource, params) => getMany(resource, params),
  getManyReference: (resource, params) =>
    getManyReference(baseProvider, resource, params),
  create: (resource, params) => create(resource, params),
  update: (resource, params) => update(resource, params),
  delete: (resource, params) => deleteOne(resource, params),
  deleteMany: (resource, params) => deleteMany(resource, params),
};
