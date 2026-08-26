import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.join(__dirname, "openapi.yaml");
const file = fs.readFileSync(openapiPath, "utf8");

export const swaggerSpec = yaml.load(file) as Record<string, unknown>;