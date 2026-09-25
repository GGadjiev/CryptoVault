import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
console.log("✓ dist/404.html создан (копия index.html)");