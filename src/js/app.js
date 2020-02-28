const master_link = "https://ucentral.blackboard.com";
const base = master_link;

async function validCategoryCourses() {
  let response = [];
  try {
    const href = window.location.href;
    let url = new URL(href);
    let params = new URLSearchParams(url.search);
    const id = params.get("current_cat_id");
    if (/catalogMgr/.test(href) && id != null) {
      const coursesByCategory = await getCoursesByCategory(id);
      if (coursesByCategory != null && coursesByCategory.results.length > 0) {
        for (const item of coursesByCategory.results) {
          const course = await getCoursesById(item.courseId);
          response.push(course);
        }
      }
    }
  } catch (error) {
    doCatch(error);
  }
  return response;
}

function usersIcon() {
  return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAklEQVQ4T83TMSvFURgG8N9dxCKFzWZRkmwGizIQXcXiE7iYJSnfwWShJCmTUclCDCZhkZkNhcVyi95/R53+kXKX+9YZzjk9z/s8z3lPRYNVaRCvuQjWsI4LVDGFTQqVizjDPTpwjPGwn1v4QGvKZBK76Er7Z2xjNcuswOYEJxjDO/pxhe4EeMIMztP+5Zs8J2jDKG7xiNnMwgIOMZykb+C1rKAPA4hukUO99MQtWEJPyiAUFxZiRVjRJSoURGgjGMQnbvCAnSynawwFeAJHCXyHFeyjvaTgDfPYQ6iJWg6C3uQ9Di5xis5fJjReo4bpdL/10yQe/DHec/l9c43yvz7mF8dpLMC3tJ3tAAAAAElFTkSuQmCC" />`;
}

async function getCoursesByCategory(category) {
  const url = `/learn/api/public/v1/catalog/categories/course/${category}/courses`;
  let response = await fetch(url);
  response = await response.json();
  return response;
}

async function getCoursesById(courseId) {
  const url = `/learn/api/public/v2/courses/${courseId}`;
  let response = await fetch(url);
  response = await response.json();
  return response;
}

async function addCoursesToCategoryUI() {
  try {
    const $container = document.createElement("div");
    const $mainDiv = document.querySelector("#containerdiv");
    let html = `<hr><h3>Cursos disponibles de la categoría</h3>`;
    const courses = await validCategoryCourses();
    if (courses.length > 0) {
      for (const course of courses) {
        html += `<a href ="${course.externalAccessUrl}" target="_blank" >${course.name}</a><br>`;
      }
      $container.innerHTML = html;
      $mainDiv.appendChild($container);
    }
  } catch (error) {
    doCatch(error);
  }
}

function addLinksToMainUltra() {
  try {
    const href = window.location.href;
    const $baseTools = document.querySelector("#base_tools");
    if ($baseTools == null) {
      return false;      
    }
    const $item = $baseTools
      .querySelectorAll("bb-base-navigation-button")[1]
      .cloneNode();
    const shorcut = `${master_link}/webapps/blackboard/execute/`;
    if (/ultra\/stream/.test(href) && $baseTools != null) {
      $baseTools.innerHTML += `<hr style="margin:0px">`;
      $baseTools.innerHTML += mainMenuItem(
        `${shorcut}courseManager?sourceType=COURSES`,
        "Cursos Admin",
        "icon-medium-courses"
      );
      $baseTools.innerHTML += mainMenuItem(
        `${shorcut}catalogMgr?cat_type=CRS`,
        "Categorías Admin",
        "icon-medium-courses"
      );
      $baseTools.innerHTML += mainMenuItem(
        `${shorcut}userManager`,
        "Usuarios Admin",
        "icon-medium-groups"
      );
      $baseTools.appendChild($item);
    }
  } catch (error) {
    doCatch(error);
  }
}

function mainMenuItem(link, text, icon) {
  return `
    <bb-base-navigation-button  
    >
      <li
        role="presentation"
        class="base-navigation-button"    
        aria-hidden="false"
      >
        <a      
          class="base-navigation-button-content themed-background-primary-alt-fill-only theme-border-left-active"      
          href="${link}"
          tabindex=""
          target="_blank"
        >
          <bb-svg-icon icon="logout" size="medium" aria-hidden="true">
            <svg
              class="svg-icon medium-icon default"
              focusable="false"
              aria-hidden="true"
              bb-cache-compilation="svg-icon"
            >
              <use
                xlink:href="https://ucentral.blackboard.com/ultra/stream#${icon}"
                ng-href="https://ucentral.blackboard.com/ultra/stream#${icon}"
              ></use>
            </svg>
          </bb-svg-icon>
          <ng-switch on="$ctrl.link.id">
            <span
              ng-switch-default=""
              class="link-text"
              bb-translate=""
              analytics-id="base.nav.logout"
              >${text}</span
            >
          </ng-switch>
          <span
            class="round alert label ng-hide"
            ng-show="counts[$ctrl.link.id]"
          ></span>
        </a>
      </li>
    </bb-base-navigation-button>    
    `;
}

function doCatch(error) {
  console.log(`error`, error);
}

function addAuxiliarMenu() {
  const par = document.createElement("div");
  par.innerHTML = `
<div class="help">
<a href="${base}/webapps/portal/execute/tabs/tabAction?tabType=admin" >Administrador</a>
<br>
<a href="${base}/webapps/blackboard/execute/courseManager?sourceType=COURSES" >Buscar cursos</a>
<br>
<a href="${base}/webapps/blackboard/execute/userManager?course_id=" >Buscar usuarios</a>
<br>
<a href="${base}/webapps/bb-data-integration-flatfile-BB5d263be42ae14/execute/uploadFeed?diId=_18_1">Subir usuarios</a>
<br>
<a href="${base}/webapps/bb-data-integration-flatfile-BB5d263be42ae14/execute/uploadFeed?diId=_20_1">Subir enrollment</a>
</div>`;

  document.body.prepend(par);
}

function addExternalScript() {
  const scr = document.createElement("script");
  scr.setAttribute("src", "http://127.0.0.1:5500/app.moodle.js");
  document.body.appendChild(scr);
}

function getUsersBlackboard() {
  try {
    const users = [];
    document.querySelectorAll("#listContainer_databody tr").forEach(e => {
      const user = {
        name: e
          .querySelector("td:nth-child(4)")
          .querySelector("span:nth-child(2)").innerHTML,
        lastname: e
          .querySelector("td:nth-child(5)")
          .querySelector("span:nth-child(2)").innerHTML,
        email: e.querySelector("td:nth-child(6)").querySelector("a").innerHTML,
        id: e
          .querySelector("td:nth-child(8)")
          .querySelector("span:nth-child(2)").innerHTML,
        fuente: e
          .querySelector("td:nth-child(9)")
          .querySelector("span:nth-child(2)").innerHTML
      };
      users.push(user);
    });
    return JSON.stringify(users);
  } catch (error) {
    console.log(`error`, error);
  }
}

function runTasks() {
  addAuxiliarMenu();
  addCoursesToCategoryUI();
  getEnrollLink();
  executeReport();
}

function addExternalScript() {
  const scr = document.createElement("script");
  scr.setAttribute("src", "http://127.0.0.1:5500/src/app.blackboard.js");
  document.body.appendChild(scr);
}

function generateFile(data) {
  const a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(
    new Blob(data, { type: "application/json" })
  );
  a.download = extractCourseId() + ".json";

  // Append anchor to body.
  document.body.appendChild(a);
  a.click();
}

function getEnrollByCourse() {
  const users = [];

  document.querySelectorAll("#listContainer_databody tr").forEach(e => {
    const user = {
      name: e.querySelectorAll("td")[2].querySelectorAll("span")[1].innerHTML,
      lastname: e.querySelectorAll("td")[3].querySelectorAll("span")[1]
        .innerHTML,
      email: e.querySelectorAll("td")[4].querySelector("a").innerHTML,
      rol: e.querySelectorAll("td")[5].querySelectorAll("span")[1].innerHTML,
      coursename: document.querySelector("#pageTitleText").innerHTML,
      courseId: extractCourseId()
    };
    users.push(user);
  });

  return users;
}

function getEnrollLink() {
  try {
    document.querySelectorAll("#listContainer_databody tr").forEach(e => {
      const newButton = document.createElement("a");
      let h = e
        .querySelectorAll("td")[1]
        .querySelectorAll("a")[0]
        .getAttribute("href")
        .replace("/webapps/blackboard/execute/courseMain?course_id=", "");
      let uri = `${base}/webapps/blackboard/execute/courseEnrollment?sortDir=ASCENDING&showAll=true&sourceType=COURSES&editPaging=false&course_id=${h}&startIndex=0`;

      newButton.setAttribute("href", uri);
      newButton.innerHTML = usersIcon();
      e.querySelectorAll("td")[1]
        .querySelectorAll("a")[0]
        .parentElement.appendChild(newButton);
    });
  } catch (e) {
    console.log(e);
  }
}

function extractCourseId(param, path = null) {
  const href = path == null ? window.location.href : path;
  let url = new URL(href);
  let params = new URLSearchParams(url.search);
  const id = params.get(param);
  return id;
}

function executeReport() {
  const h = window.location.href;
  const regex = /\/webapps\/blackboard\/execute\/courseEnrollment\?sortDir=ASCENDING&showAll=true&sourceType=COURSES&editPaging=false&course_id=/;
  console.log(regex.test(h));
  if (regex.test(h)) {
    //saveJSON(getEnrollByCourse(), extractCourseId("course_id") + ".json");
  }
}

function saveJSON(data, filename) {
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
}

runTasks();

//addExternalScript();
