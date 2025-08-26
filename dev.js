const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const redbrickDir = path.join(__dirname, "redbrick-project");
const subfolders = fs
  .readdirSync(redbrickDir)
  .filter((name) => fs.statSync(path.join(redbrickDir, name)).isDirectory());

if (subfolders.length === 0) {
  console.error("❌ inner_project 폴더가 없습니다.");
  process.exit(1);
}

const innerProject = subfolders[0]; // 기준에 맞는 폴더 선택. 필요하면 정렬 등 추가
const projectPath = path.join(redbrickDir, innerProject);

console.log(`🟢 inner_project: ${innerProject}에서 Vite dev 서버 실행`);
execSync("npm install", { stdio: "inherit" });
execSync("npm run dev", { cwd: projectPath, stdio: "inherit" });
