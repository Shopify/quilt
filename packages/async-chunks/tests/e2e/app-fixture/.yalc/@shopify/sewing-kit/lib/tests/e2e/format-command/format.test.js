"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../utilities");
const fixture = path_1.resolve(__dirname, 'fixtures', 'format');
const client = path_1.resolve(fixture, 'client');
const eslintrcTemplate = path_1.resolve(fixture, '.eslintrc.json.template');
const eslintrc = path_1.resolve(fixture, '.eslintrc.json');
const index = path_1.resolve(client, 'javascript', 'index.js');
const originalIndex = fs_extra_1.readFileSync(index);
const indexFix = path_1.resolve(client, 'javascript', 'index.fix.js');
const graphql = path_1.resolve(client, 'graphql', 'index.graphql');
const originalGraphql = fs_extra_1.readFileSync(graphql);
const graphqlFix = path_1.resolve(client, 'graphql', 'index.fix.graphql');
const gqlTag = path_1.resolve(client, 'gql-tag', 'index.js');
const originalGqlTag = fs_extra_1.readFileSync(gqlTag);
const gqlTagFix = path_1.resolve(client, 'gql-tag', 'index.fix.js');
const json = path_1.resolve(client, 'json', 'index.json');
const originalJSON = fs_extra_1.readFileSync(json);
const jsonFix = path_1.resolve(client, 'json', 'index.fix.json');
const markdown = path_1.resolve(client, 'markdown', 'index.md');
const originalMarkdown = fs_extra_1.readFileSync(markdown);
const markdownFix = path_1.resolve(client, 'markdown', 'index.fix.md');
const styles = path_1.resolve(client, 'scss', 'styles.scss');
const originalStyles = fs_extra_1.readFileSync(styles);
const stylesFix = path_1.resolve(client, 'scss', 'styles.fix.scss');
describe('format', () => {
    beforeAll(() => {
        fs_extra_1.renameSync(eslintrcTemplate, eslintrc);
        child_process_1.execSync(`${utilities_1.sewingKitCLI} format`, { cwd: fixture, stdio: 'inherit' });
    });
    afterAll(() => {
        if (fs_extra_1.existsSync(eslintrc)) {
            fs_extra_1.renameSync(eslintrc, eslintrcTemplate);
        }
        fs_extra_1.writeFileSync(index, originalIndex);
        fs_extra_1.writeFileSync(graphql, originalGraphql);
        fs_extra_1.writeFileSync(gqlTag, originalGqlTag);
        fs_extra_1.writeFileSync(json, originalJSON);
        fs_extra_1.writeFileSync(markdown, originalMarkdown);
        fs_extra_1.writeFileSync(styles, originalStyles);
    });
    it('formats javascript', () => {
        expect(fs_extra_1.readFileSync(index, 'utf8')).toBe(fs_extra_1.readFileSync(indexFix, 'utf8'));
    });
    it('formats .graphql files', () => {
        expect(fs_extra_1.readFileSync(graphql, 'utf8')).toBe(fs_extra_1.readFileSync(graphqlFix, 'utf8'));
    });
    it('formats gql blocks', () => {
        expect(fs_extra_1.readFileSync(gqlTag, 'utf8')).toBe(fs_extra_1.readFileSync(gqlTagFix, 'utf8'));
    });
    it('formats json', () => {
        expect(fs_extra_1.readFileSync(json, 'utf8')).toBe(fs_extra_1.readFileSync(jsonFix, 'utf8'));
    });
    it('formats markdown', () => {
        expect(fs_extra_1.readFileSync(markdown, 'utf8')).toBe(fs_extra_1.readFileSync(markdownFix, 'utf8'));
    });
    it('formats scss', () => {
        expect(fs_extra_1.readFileSync(styles, 'utf8')).toBe(fs_extra_1.readFileSync(stylesFix, 'utf8'));
    });
});