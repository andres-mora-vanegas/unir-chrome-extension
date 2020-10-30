util.doCatch = function (error) {
  console.log(`error`, error);
};

util.formatDate = (str) => {
  try {
    if (str !== null && str != undefined) {
      return moment(str).format("DD-MM-YYYY HH:mm");
    }
    return "Nunca";
  } catch (error) {
    util.doCatch(error);
  }
};

util.addExternalScriptBB = function () {
  const scr = document.createElement("script");
  scr.setAttribute("src", "http://127.0.0.1:5500/dist/app-joined.js");
  document.body.appendChild(scr);
};
util.addExternalScriptMoodle = function () {
  const scr = document.createElement("script");
  scr.setAttribute("src", "http://127.0.0.1:5500/app.moodle.js");
  document.body.appendChild(scr);
};

util.liveEvents = () => {
  window.addEventListener("click", async function (e) {
    if (/central-activate-enroll/.test(e.target.classList)) {
      e.preventDefault();
      await blackboard.handleEnrollActivate(e);
    }
    if (/central-delete-enroll/.test(e.target.classList)) {
      e.preventDefault();
      blackboard.handleEnrollDelete(e);
    }
    if (/onlyActive/.test(e.target.classList)) {
      await blackboard.onlyActiveAction(e);
    }
    if (/userAnalytics/.test(e.target.classList)) {
      await blackboard.getCourseAnalytics(e);
    }
    if (/viewAnalyticDetail/.test(e.target.classList)) {
      await blackboard.getCourseAnalyticsDetail(e);
    }
  });
};
util.generateJSON = function (data, filename) {
  if (!data) {
    console.error("No data");
    return;
  }

  if (!filename) filename = "console.json";

  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }

  var blob = new Blob([data], { type: "text/json" }),
    e = document.createEvent("MouseEvents"),
    a = document.createElement("a");

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  e.initMouseEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
};

util.formToJson = function (form) {
  var obj = {};
  var elements = form.querySelectorAll("input, select, textarea");
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var name = element.name;
    var value = element.value;

    if (name) {
      obj[name] = value;
    }
  }

  return JSON.stringify(obj);
};
