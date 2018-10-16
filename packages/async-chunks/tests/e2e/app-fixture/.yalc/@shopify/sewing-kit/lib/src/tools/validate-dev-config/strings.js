"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const { bold } = chalk_1.default;
const devYaml = bold('dev.yml');
const railgunYaml = bold('railgun.yml');
const typeRuby = bold('type: "ruby"');
const typeRails = bold('type: "rails"');
const server = bold('server');
const port = bold('port');
const proxyToHost = bold('proxy_to_host_port');
const devInit = bold('dev init');
exports.VANILLA_RUBY = `
sewing kit builds Rails applications, but ${devYaml} contains ${typeRuby}.

To resolve this try regenerating the project with ${devInit} and choosing ${typeRails}
`.trim();
exports.PORT_MISMATCH = `
sewing kit cannot serve development assets because of port conflicts between ${devYaml} and ${railgunYaml}.

To resolve this:
• ${devYaml} must contain a top-level ${server} command with a ${port} attribute
• ${railgunYaml} must contain a \`hostnames\` entry with a ${proxyToHost} attribute that matches ${devYaml}'s server port
`.trim();