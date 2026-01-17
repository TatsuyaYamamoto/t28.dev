import { execSync } from "node:child_process";

import type { APIRoute } from "astro";

import packageJson from "../../package.json";

const dependencies = Object.keys(packageJson.dependencies).join(", ");
const devDependencies = Object.keys(packageJson.devDependencies).join(", ");
const tab = "\t";
const latestGitHash = execSync("git rev-parse --short HEAD").toString().trim();
const latestYyyyMmDd = execSync(
  "git show -s --format=%cd --date=format:%Y/%m/%d",
)
  .toString()
  .trim();

export const GET: APIRoute = async () => {
  const text = `
/* TEAM */
${tab}Web frontend engineer: YAMAMOTO Tatsuya
${tab}Twitter: https://twitter.com/T28_tatsuya
${tab}X: https://x.com/T28_tatsuya
${tab}GitHub: https://github.com/TatsuyaYamamoto
${tab}From: Tokyo, Japan

/* THANKS */
${tab}This text format: https://humanstxt.org
${tab}This site's dependencies: ${dependencies}
${tab}This site's devDependencies: ${devDependencies}

/* SITE */
${tab}Last update: ${latestYyyyMmDd} (https://github.com/TatsuyaYamamoto/t28.dev/commit/${latestGitHash})
${tab}Language: Japanese
`.trim();

  return new Response(text);
};
