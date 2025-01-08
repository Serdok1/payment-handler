import dotenv from "dotenv";
import express from "express";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

dotenv.config();
const router = express.Router();
const window = new JSDOM("").window;
const purify = DOMPurify(window);

export { router, purify };
