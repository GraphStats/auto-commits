const { exec } = require("child_process");
const fs = require("fs");

function updateAndCommit() {
  const now = new Date();
  const random = Math.floor(Math.random() * 100000);
  const content = `Auto-update: ${now.toISOString()} - ${random}`;
  fs.writeFileSync("update.txt", content);
  console.log(`📝 ${content}`);

  exec('git pull && git add update.txt && git commit -m "Auto-update" && git push', (err, stdout, stderr) => {
    if (err) return console.error("❌ Git error:", err.message);
    if (stderr) console.warn("⚠️ stderr:", stderr);
    console.log("✅ Résultat :", stdout);
  });
}

// Vérifie si on est bien dans un repo Git
if (!fs.existsSync(".git")) {
  console.error("❌ Pas de dossier .git, init Git d'abord !");
  process.exit(1);
}

setInterval(updateAndCommit, 900);
