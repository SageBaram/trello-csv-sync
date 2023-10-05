import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const CSV_FILE_PATH = path.join(__dirname, "../requirements.csv");
export const API_KEY = process.env.TRELLO_API_KEY;
export const TOKEN = process.env.TRELLO_OAUTH_TOKEN;
export const LIST_ID = process.env.BACKLOG_ID;
export const BOARD_ID = process.env.BOARD_ID;
