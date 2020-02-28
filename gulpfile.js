var gulp = require("gulp");
var gulpSequence = require("gulp-sequence");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var UglifyJS = require("uglify-js");
var watch = require("gulp-watch");
var pump = require("pump");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var concatCss = require("gulp-concat-css");
var cleanCSS = require("gulp-clean-css");
var replace = require("gulp-replace");
var fs = require("fs");
var gulpCopy = require("gulp-copy");
var zip = require("gulp-zip");
const runSequence = require("gulp4-run-sequence");

var watch = require("node-watch");

function replaceBulk(e, n, r) {
  var u,
    c = [],
    l = {};
  for (u = 0; u < n.length; u++)
    c.push(n[u].replace(/([-[\]{}()*+?.\\^$|#,])/g, "\\$1")), (l[n[u]] = r[u]);
  return (
    (c = c.join("|")),
    (e = e.replace(new RegExp(c, "g"), function(e) {
      return l[e];
    }))
  );
}
/**
 * función que se encarga de comprimir el archivo base/app.js y lo minifica
 */
gulp.task("compressAppJs", () => {
  return gulp
    .src("src/js/app.js")
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/"));
});

/**
 * tarea que se encarga de obtener el contenido de los archivos
 * dist/app.css y base/app.css y lo reemplaza por el valor
 * que se encuentra en content.js
 *
 */
gulp.task("replace", function() {
  var fileContent = fs.readFileSync("dist/app.js", "utf8");
  var fileStyles = fs.readFileSync("src/css/app.css", "utf8");
  return gulp
    .src(["content.js"])
    .pipe(replace("#allContent#", fileContent))
    .pipe(replace("#allStyles#", fileStyles))
    .pipe(gulp.dest("dist/"));
});

/**
 * tarea que se encarga de reemplazar los templates
 */
gulp.task("replaceTemplates", function() {
  function readFile(element) {
    let response = "";
    try {
      response = fs.readFileSync(element, "utf8");
    } catch (error) {
      // console.log(error);
      console.log(
        "#########################------error buscando archivo--------------##########################"
      );
    }
    return response;
  }
  let fileContent = "";
  try {
    fileContent = fs.readFileSync("dist/content.js", "utf8");
    let toReplace = fileContent.match(/{{{import\('(.*)'\)}}}/g);
    let toReplaceArr = [];
    if (toReplace.length > 0) {
      for (let i = 0; i < toReplace.length; i++) {
        const element =
          "./templates/" +
          toReplace[i].replace("{{{import('", "").replace("')}}}", "") +
          ".html";
        try {
          let cache_ = readFile(element);
          toReplaceArr.push(cache_);
        } catch (error) {
          //console.log(error);
          console.log(
            "#########################--------error leyendo archivo  2------------##########################"
          );
        }
      }
      fileContent = replaceBulk(fileContent, toReplace, toReplaceArr);
    }
  } catch (error) {
    console.log(
      "#########################-------error leyendo archivo 1-------------##########################"
    );
    //console.log(error);
  }
  //console.log(fileContent);
  fs.writeFileSync("dist/app.min.js", fileContent);
});

/**
 * tarea que se encarga de comprimir el archivo js unificado
 */
gulp.task("compressJs", () => {
  return gulp
    .src("dist/app.min.js")
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/"));
});

/**
 * método que se encarga de mover los archivo para publicar la extensión a una carpeta.
 */
gulp.task("move", function() {
  let sourceFiles = [
    "src/js/popup.js",
    "icon.png",
    "dist/app.js",
    "src/js/jquery-3.2.1.min.js",
    "manifest.json",
    "src/html/popup.html",
    "src/js/popup.js"
  ];
  let destination = "toDeploy/";
  let outputPath = "toDeploy/";
  return gulp.src(sourceFiles).pipe(gulp.dest(destination));
});
/**
 * método que se encarga de comprimir los archivos que se encuentran en la carpeta seleccionada y crea el zip para publicar.
 */
gulp.task("zip", function() {
  return gulp
    .src("toDeploy/*")
    .pipe(zip("deploy.zip"))
    .pipe(gulp.dest("./"));
});

/**
 * método que se encarga de observar cambios para compilar el archivo final
 */
watch("src/", { recursive: true }, function(evt, name) {
  runSequence(
    ["compressAppJs"],
    /* ['replace'], ['replaceTemplates'], */ /* ['compressJs'], */ ["move"],
    ["zip"]
  );
  console.log(`compilación correcta`);
});
