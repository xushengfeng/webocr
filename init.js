import { existsSync, mkdirSync, writeFileSync } from "fs";
import download from "download";

if (!existsSync("./public/ocr")) {
    mkdirSync("./public/ocr", { recursive: true });
    await download("https://github.com/xushengfeng/eSearch-OCR/releases/download/4.0.0/ch.zip", "./public/ocr", {
        rejectUnauthorized: false,
        extract: true,
    });
}
