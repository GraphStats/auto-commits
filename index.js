const { exec } = require("child_process");
const fs = require("fs");

const REPO_URL = "https://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@github.com/graphstats/auto-commits.git";
const BRANCH = "main";
const COMMIT_INTERVAL = 500; // toutes les 30 secondes

function run(cmd, callback) {
  exec(cmd, (err, stdout, stderr) => {
    if (err) console.error("❌ Erreur :", err.message);
    if (stderr) console.warn("⚠️ stderr :", stderr);
    if (stdout) console.log(stdout);
    if (callback) callback();
  });
}

function updateAndCommit() {
  const now = new Date();
  const random = Math.floor(Math.random() * 100000);
  const content = `Auto-update: ${now.toISOString()} - ${random}`;
  
  const prevContent = fs.existsSync("update.txt") ? fs.readFileSync("update.txt", "utf8") : "";
  if (prevContent === content) return; // pas de changement → pas de commit

  fs.writeFileSync("update.txt", content);
  console.log(`📝 ${content}`);

  // Commit et push
  run(
    `git config user.email "no.replybot5455@gmail.com" && \
     git config user.name "GraphStats Bot" && \
     git add update.txt && \
     git commit -m "Auto-update" || echo "No changes to commit" && \
     git push origin ${BRANCH}`
  );
}

function startAutoUpdate() {
  console.log(`🚀 Lancement de l'auto-update toutes les ${COMMIT_INTERVAL / 1000}s`);
  updateAndCommit(); // commit immédiat
  setInterval(updateAndCommit, COMMIT_INTERVAL);
}

if (!fs.existsSync(".git")) {
  console.log("🚀 Initialisation du dépôt Git...");
  run(
    `git init && git branch -M ${BRANCH} && git remote add origin ${REPO_URL} && git pull origin ${BRANCH} --allow-unrelated-histories`,
    startAutoUpdate
  );
} else {
  // Synchronisation correcte avec le remote
  run(
    `git fetch origin && git reset --hard origin/${BRANCH} && git clean -fd`,
    startAutoUpdate
  );
}
