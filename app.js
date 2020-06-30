const watch = require("node-watch");
const fs = require("fs-extra");
const zipFolder = require("zip-a-folder");

function zip() {
  zipFolder.zipFolder("./toDeploy", "./deploy.zip", function (err) {
    if (err) {
      console.log(`error`, erro);
    }
  });
}

function joinLibs() {
  try {
    const moodle = fs.readFileSync("./src/js/moodle.js", "utf8");
    const blackboard = fs.readFileSync("./src/js/blackboard.js", "utf8");
    const manifest = fs.readFileSync("./manifest.json", "utf8");
    const css = fs.readFileSync("./src/css/app.css", "utf8");
    const dir = "./toDeploy";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + "/content.js", moodle + blackboard);
    fs.writeFileSync(dir + "/styles.css", css);
    fs.writeFileSync(dir + "/manifest.json", manifest);
    fs.copySync("./icon.png", dir + "/icon.png");
  } catch (error) {
    console.log(`error`, error);
  }
}

watch("src/", { recursive: true }, function (evt, name) {
  joinLibs();
  zip();
  console.log("%s changed.", name);
});
