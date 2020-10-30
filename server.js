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

async function joinJsFiles() {
  try {
    const jsfolder = fs.readdirSync("./src/js/");
    let concat = "";
    if (jsfolder.length > 0) {
      for (const file of jsfolder) {
        concat += fs.readFileSync("./src/js/" + file, "utf8");
      }
      fs.writeFileSync("./dist/app-joined.js", concat, "utf8");
    }
  } catch (error) {
    console.log(`error`, error);
  }
}

function joinLibs() {
  try {
    const moment = fs.readFileSync("./src/js/moment.js", "utf8") + "\n";
    // const moment = "";
    const joined = fs.readFileSync("./dist/app-joined.js", "utf8");
    const manifest = fs.readFileSync("./manifest.json", "utf8");
    const css = fs.readFileSync("./src/css/app.css", "utf8");
    const dir = "./toDeploy";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + "/content.js", moment + joined);
    fs.writeFileSync(dir + "/styles.css", css);
    fs.writeFileSync(dir + "/manifest.json", manifest);
    fs.copySync("./icon.png", dir + "/icon.png");
  } catch (error) {
    console.log(`error`, error);
  }
}

watch("src/", { recursive: true }, function (evt, name) {
  joinJsFiles();
  joinLibs();
  zip();
  console.log("%s changed.", name);
});
