import * as npm from "./npm-api";
import phrases from "../data/phrases.json";
import ora from "ora";
import fs from "fs-extra";
import path from "path";

const pkgpath = path.join(process.cwd(), "generated/package.json");
const modulespath = path.join(process.cwd(), "generated/modules.json");

Array.prototype.asyncForEach = async function asyncForEach(callback) {
  const array = this;
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

async function app() {
  let data = [];
  const spinner = ora({
    color: "yellow",
    text: "Fetching modules...",
  }).start();
  await phrases.asyncForEach(async ({ text }) => {
    data = data.concat(await npm.search(text));
  });
  spinner.stop();
  await fs.writeJSON(modulespath, data);
  console.log(data);
  console.log("Wrote to ./generated/modules.json");
  console.log("Applying to package.json (./generated/package.json)");
  const pkg = await fs.readJSON(pkgpath);
  pkg.dependencies = {};
  data.forEach((module, i) => {
    if (i >= 1000) return;
    pkg.dependencies[module] = "latest";
  });
  await fs.writeFile(pkgpath, JSON.stringify(pkg, null, 2));
  console.log("Written package.json");
}
app();
