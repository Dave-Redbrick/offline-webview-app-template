const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const viteBaseDir = path.resolve(__dirname, "redbrick-project");
const rnAssetDir = path.resolve(
  __dirname,
  "mobile/android/app/src/main/assets/web"
);

// 경로 수정 함수 (재귀적)
async function fixPathsInFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await fixPathsInFiles(fullPath);
    } else {
      if (/\.(html|js|tsx|jsx|css)$/.test(entry.name)) {
        let content = await fs.readFile(fullPath, "utf8");

        // 경로 패턴 수정 (절대경로 → 상대경로)
        content = content.replace(/href="\/assets\//g, 'href="./assets/');
        content = content.replace(/src="\/assets\//g, 'src="./assets/');
        content = content.replace(/url\("\/assets\//g, 'url("./assets/'); // CSS url()

        await fs.writeFile(fullPath, content, "utf8");
        console.log(`📝 경로 수정 완료: ${fullPath}`);
      }
    }
  }
}

async function build(redbrickProjectName) {
  if (!redbrickProjectName) {
    const entries = await fs.readdir(viteBaseDir, { withFileTypes: true });
    const firstDir = entries.find((e) => e.isDirectory());
    if (!firstDir) {
      console.error(
        `❌ 빌드할 Redbrick 프로젝트 폴더가 없습니다. vite/ 안에 폴더를 넣어주세요.`
      );
      process.exit(1);
    }
    redbrickProjectName = firstDir.name;
    console.log(
      `ℹ️ 폴더명이 지정되지 않아 첫 번째 폴더 (${redbrickProjectName}) 로 빌드합니다.`
    );
  }

  const viteProjectPath = path.join(viteBaseDir, redbrickProjectName);
  if (!fs.existsSync(viteProjectPath)) {
    console.error(`❌ 경로가 존재하지 않습니다: ${viteProjectPath}`);
    process.exit(1);
  }

  // 빌드
  process.chdir(viteProjectPath);
  execSync("npm install", { stdio: "inherit" });
  execSync("npm run build", { stdio: "inherit" });

  // 복사
  await fs.remove(rnAssetDir);
  await fs.copy(path.join(viteProjectPath, "dist"), rnAssetDir);

  // 경로 수정 (빌드 폴더 내 모든 대상 파일)
  await fixPathsInFiles(rnAssetDir);

  console.log("✅ 빌드 및 복사 완료");
}

const projectName = process.argv[2];
build(projectName);
