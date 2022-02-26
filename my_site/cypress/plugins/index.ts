/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import {
  resetNextAuthTable,
  seedNextAuthTable,
} from "../../src/life-in-weeks/utils";
import * as fs from "fs";
import * as path from "path";

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    "db:reset": () => {
      return resetNextAuthTable();
    },
    "db:seed": (sessionName: string) => {
      const jsonPath = path.join(__dirname, `../fixtures/${sessionName}`);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const session = JSON.parse(fs.readFileSync(jsonPath));
      return seedNextAuthTable(session);
    },
  });
};
