const master_link = window.location.origin;
const base = master_link;

const blackboard = {
  validCategoryCourses: async function () {
    let response = [];
    try {
      const href = window.location.href;
      let url = new URL(href);
      let params = new URLSearchParams(url.search);
      const id = params.get("current_cat_id");
      if (/catalogMgr/.test(href) && id != null) {
        const coursesByCategory = await blackboard.getCoursesByCategory(id);
        if (coursesByCategory != null && coursesByCategory.results.length > 0) {
          for (const item of coursesByCategory.results) {
            const course = await blackboard.getCoursesById(item.courseId);
            response.push(course);
          }
        }
      }
    } catch (error) {
      blackboard.doCatch(error);
    }
    return response;
  },
  usersIcon: () => {
    return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAklEQVQ4T83TMSvFURgG8N9dxCKFzWZRkmwGizIQXcXiE7iYJSnfwWShJCmTUclCDCZhkZkNhcVyi95/R53+kXKX+9YZzjk9z/s8z3lPRYNVaRCvuQjWsI4LVDGFTQqVizjDPTpwjPGwn1v4QGvKZBK76Er7Z2xjNcuswOYEJxjDO/pxhe4EeMIMztP+5Zs8J2jDKG7xiNnMwgIOMZykb+C1rKAPA4hukUO99MQtWEJPyiAUFxZiRVjRJSoURGgjGMQnbvCAnSynawwFeAJHCXyHFeyjvaTgDfPYQ6iJWg6C3uQ9Di5xis5fJjReo4bpdL/10yQe/DHec/l9c43yvz7mF8dpLMC3tJ3tAAAAAElFTkSuQmCC" />`;
  },
  organizationIcon: () => {
    return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmElEQVQ4T+3TsQkCQRCF4e9C7cMqDCxCBVEj+7jAUjQRRQRjC7AKy1ATAznYNThZbo8zdLJl5v3MzrwpdIwioR+gRD/kH1jjVq9PAbYY4RoEQ1ywygUc8cIsCOrvDyd2MMUGvcyRPLHEKQIOqCBtYod5BFQtjtuosa+++Af8cAad1zgJRoreb9roHQucU7fQBPiycragXvgGr1wgEdi2CvkAAAAASUVORK5CYII=" />`;
  },
  courseIcon: () => {
    return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA90lEQVQ4T6XTuy4EYRjG8d/agkpQULoDcS9IhCsQh0Ihcaocit1yFzdAIXEhSuIOqDRER+GQNz6bL2t2jMyUk+/7P/P833caaj6NmveVAWbRSgFbuCkKKwJM4whL9AI+cYFd3OegHDCRDqxieEC1N3RTwHOcCcAINrCNsYpO4vIxOj+Adez8EzAeNfMK8SI6rv1RoZPSn7DQL3EGLzjEcibxI0ncxyjuEGJ/Aa4whRA51DfG0HOCByyWAebwjlNEYnzlAVbQxGUZIGS2MwePCTCZpvOKTZxhHteDFqnIwTn2UoXetKuscsiKVb6tusoVd+n7WO2/8QulMjHdyCMI0QAAAABJRU5ErkJggg==" />`;
  },
  getCoursesByCategory: async (category) => {
    const url = `/learn/api/public/v1/catalog/categories/course/${category}/courses`;
    let response = await fetch(url);
    response = await response.json();
    return response;
  },
  getCoursesById: async (courseId) => {
    const url = `/learn/api/public/v2/courses/${courseId}`;
    let response = await fetch(url);
    response = await response.json();
    return response;
  },
  addCoursesToCategoryUI: async function () {
    try {
      const $container = document.createElement("div");
      const $mainDiv = document.querySelector("#containerdiv");
      let html = `<hr><h3>Cursos disponibles de la categoría</h3>`;
      const courses = await blackboard.validCategoryCourses();
      if (courses.length > 0) {
        for (const course of courses) {
          html += `<a href ="${course.externalAccessUrl}" target="_blank" >${course.name}</a><br>`;
        }
        $container.innerHTML = html;
        $mainDiv.appendChild($container);
      }
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  addLinksToMainUltra: function () {
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
        $baseTools.innerHTML += blackboard.mainMenuItem(
          `${shorcut}courseManager?sourceType=COURSES`,
          "Cursos Admin",
          "icon-medium-courses"
        );
        $baseTools.innerHTML += blackboard.mainMenuItem(
          `${shorcut}catalogMgr?cat_type=CRS`,
          "Categorías Admin",
          "icon-medium-courses"
        );
        $baseTools.innerHTML += blackboard.mainMenuItem(
          `${shorcut}userManager`,
          "Usuarios Admin",
          "icon-medium-groups"
        );
        $baseTools.appendChild($item);
      }
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  mainMenuItem: function (link, text, icon) {
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
                    <usek¿
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
  },
  doCatch: function (error) {
    console.log(`error`, error);
  },
  addAuxiliarMenu: function () {
    const par = document.createElement("div");
    par.innerHTML = `
      <div class="help">
      <a href="${base}/webapps/portal/execute/tabs/tabAction?tabType=admin" >Administrador</a>
      <br>
      <a href="${base}/webapps/blackboard/execute/courseManager?sourceType=COURSES" >Buscar cursos</a>
      <br>
      <a href="${base}/webapps/blackboard/execute/courseManager?sourceType=CLUBS" >Buscar organizaciones</a>
      <br>
      <a href="${base}/webapps/blackboard/execute/userManager?course_id=" >Buscar usuarios</a>
      <br>
      <a href="${base}/webapps/usf-impersonate-BB5d263be42ae14/link.jsp" >Entrar como</a>
      <br>
      <a href="${base}/webapps/bb-data-integration-flatfile-BB5d263be42ae14/execute/uploadFeed?diId=_18_1">Subir archivos</a>
      </div>`;

    document.body.prepend(par);
  },
  addExternalScript: function () {
    const scr = document.createElement("script");
    scr.setAttribute("src", "http://127.0.0.1:5500/app.moodle.js");
    document.body.appendChild(scr);
  },
  getUsersBlackboard: function () {
    try {
      const users = [];
      document.querySelectorAll("#listContainer_databody tr").forEach((e) => {
        const user = {
          name: e
            .querySelector("td:nth-child(4)")
            .querySelector("span:nth-child(2)").innerHTML,
          lastname: e
            .querySelector("td:nth-child(5)")
            .querySelector("span:nth-child(2)").innerHTML,
          email: e.querySelector("td:nth-child(6)").querySelector("a")
            .innerHTML,
          id: e
            .querySelector("td:nth-child(8)")
            .querySelector("span:nth-child(2)").innerHTML,
          fuente: e
            .querySelector("td:nth-child(9)")
            .querySelector("span:nth-child(2)").innerHTML,
        };
        users.push(user);
      });
      return JSON.stringify(users);
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  getDates: async (email) => {
    try {
      const url = `/learn/api/public/v1/users/userName:${email}?fields=created,modified,lastLogin`;
      let response = await fetch(url);
      response = await response.json();
      return response;
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  getDatesOfUsers: async () => {
    try {
      if (/userManager\?course_id=/.test(window.location.href)) {
        const dataBody = document.querySelectorAll(
          "#listContainer_databody tr"
        );
        const dataHead = document.querySelector(".inventoryListHead tr");
        if (dataBody) {
          const created = document.createElement("th");
          const modified = document.createElement("th");
          const lastLogin = document.createElement("th");
          created.innerHTML = `<a>Fecha de creación</a>`;
          modified.innerHTML = `<a>Fecha de modificación</a>`;
          lastLogin.innerHTML = `<a>Último login</a>`;
          dataHead.appendChild(lastLogin);
          dataHead.appendChild(created);
          dataHead.appendChild(modified);
          for (const tr of dataBody) {
            const username = tr
              .querySelector(".profileCardAvatarThumb")
              .innerText.trim();
            const response = await blackboard.getDates(username);

            const createdData = document.createElement("td");
            const modifiedData = document.createElement("td");
            const lastLoginData = document.createElement("td");

            createdData.innerHTML = `<a>${blackboard.formatDate(
              response.created
            )}</a>`;
            modifiedData.innerHTML = `<a>${blackboard.formatDate(
              response.modified
            )}</a>`;
            lastLoginData.innerHTML = `<a>${blackboard.formatDate(
              response.lastLogin
            )}</a>`;

            tr.appendChild(lastLoginData);
            tr.appendChild(createdData);
            tr.appendChild(modifiedData);
          }
        }
      }
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  getLastLoginInfo: async (course, email, external = false) => {
    try {
      course = external ? `externalId:${course}` : course;

      const url = `/learn/api/public/v1/courses/${course}/users/userName:${email}?fields=created,modified,lastAccessed`;
      let response = await fetch(url);
      response = await response.json();
      return response;
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  getLastLogin: async () => {
    try {
      if (/courseEnrollment|userEnrollment/.test(window.location.href)) {
        const href = window.location.href;
        let url = new URL(href);
        let params = new URLSearchParams(url.search);
        let course = params.get("course_id");
        const userId = params.get("user_id");

        blackboard.addOnlyActive();
        let email = document.querySelector("#pageTitleText").innerText;
        email = email.split(" ");
        email = email[email.length - 1];

        const dataBody = document.querySelectorAll(
          "#listContainer_databody tr"
        );
        const dataHead = document.querySelector(".inventoryListHead tr");
        if (dataBody) {
          const created = document.createElement("th");
          const modified = document.createElement("th");
          const lastLogin = document.createElement("th");
          created.innerHTML = `<a>Fecha de inscripción</a>`;
          modified.innerHTML = `<a>Fecha de modificación</a>`;
          lastLogin.innerHTML = `<a>Último acceso</a>`;
          dataHead.appendChild(lastLogin);
          dataHead.appendChild(created);
          dataHead.appendChild(modified);
          for (const tr of dataBody) {
            const username =
              userId == null ? tr.querySelector("th").innerText.trim() : email;
            course =
              userId == null
                ? course
                : tr
                    .querySelectorAll("td")[1]
                    .querySelector(".table-data-cell-value")
                    .innerText.trim();
            const external = userId != null ? true : false;
            const response = await blackboard.getLastLoginInfo(
              course,
              username,
              external
            );

            const createdData = document.createElement("td");
            const modifiedData = document.createElement("td");
            const lastLoginData = document.createElement("td");
            const options = document.createElement("td");

            const checkInactivate = tr.querySelector("td input");

            const toggle =
              checkInactivate == null
                ? `<a class="central-activate-enroll pointer" data-id="${username}|${course}" >Activar</a>`
                : ``;
            options.innerHTML = `
            ${toggle}
            <a class="central-delete-enroll pointer" data-id="${username}|${course}">Eliminar</a>
            `;

            createdData.innerHTML = `<a>${blackboard.formatDate(
              response.created
            )}</a>`;
            modifiedData.innerHTML = `<a>${blackboard.formatDate(
              response.modified
            )}</a>`;
            lastLoginData.innerHTML = `<a>${blackboard.formatDate(
              response.lastAccessed
            )}</a>`;

            tr.appendChild(lastLoginData);
            tr.appendChild(createdData);
            tr.appendChild(modifiedData);
            // tr.appendChild(options);
          }
        }
      }
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  addOnlyActive: () => {
    try {
      const titleDiv = document.querySelector("#pageTitleDiv");
      const check = document.createElement("div");
      check.setAttribute("class", "float-right");
      check.innerHTML = `<label for="onlyActive">Solo activos </label><input type="checkbox" id="onlyActive" class="onlyActive">`;
      titleDiv.appendChild(check);
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  formatDate: (str) => {
    try {
      if (str !== null && str != undefined) {
        return moment(str).format("DD-MM-YYYY HH:mm");
      }
      return "Nunca";
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  addExternalScript: function () {
    const scr = document.createElement("script");
    scr.setAttribute("src", "http://127.0.0.1:5500/src/app.blackboard.js");
    document.body.appendChild(scr);
  },
  generateFile: function (data) {
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(
      new Blob(data, { type: "application/json" })
    );
    a.download = blackboard.extractCourseId() + ".json";

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();
  },
  getEnrollByCourse: function () {
    const users = [];

    document.querySelectorAll("#listContainer_databody tr").forEach((e) => {
      const user = {
        name: e.querySelectorAll("td")[2].querySelectorAll("span")[1].innerHTML,
        lastname: e.querySelectorAll("td")[3].querySelectorAll("span")[1]
          .innerHTML,
        email: e.querySelectorAll("td")[4].querySelector("a").innerHTML,
        rol: e.querySelectorAll("td")[5].querySelectorAll("span")[1].innerHTML,
        coursename: document.querySelector("#pageTitleText").innerHTML,
        courseId: extractCourseId(),
      };
      users.push(user);
    });

    return users;
  },
  getEnrollLink: function () {
    try {
      if (!/courseManager/.test(window.location.href)) {
        return false;
      }
      const trs = document.querySelectorAll("#listContainer_databody tr");

      trs.forEach((e) => {
        const newButton = document.createElement("a");
        let h = e
          .querySelectorAll("td")[1]
          .querySelectorAll("a")[0]
          .getAttribute("href")
          .replace("/webapps/blackboard/execute/courseMain?course_id=", "");
        let uri = `${base}/webapps/blackboard/execute/courseEnrollment?sortDir=ASCENDING&showAll=true&sourceType=COURSES&editPaging=false&course_id=${h}&startIndex=0`;

        newButton.setAttribute("href", uri);
        newButton.setAttribute("target", "_blank");
        newButton.setAttribute("title", "Inscripciones");
        newButton.setAttribute("style", "float:right");

        newButton.innerHTML = blackboard.usersIcon();
        e.querySelectorAll("td")[1]
          .querySelectorAll("a")[0]
          .parentElement.parentElement.appendChild(newButton);
      });
    } catch (e) {
      blackboard.doCatch(e);
    }
  },
  getUserLinkFromEnroll: function () {
    try {
      if (!/execute\/courseEnrollment/.test(window.location.href)) {
        return false;
      }
      const trs = document.querySelectorAll("#listContainer_databody tr");

      trs.forEach((e) => {
        const organizationButton = document.createElement("a");

        const newButton = document.createElement("a");
        let h = e
          .querySelectorAll("th")[0]
          .querySelectorAll("span")[1]
          .getAttribute("bb:contextparameters");

        const arr = h.split("&enrollType=");
        h = arr[0].replace("course_id=&user_id=", "");
        let courses = `${base}/webapps/blackboard/execute/userEnrollment?nav_item=list_courses_by_user&group_type=Course&user_id=${h}`;

        newButton.setAttribute("href", courses);
        newButton.setAttribute("target", "_blank");
        newButton.setAttribute("style", "float:right");
        newButton.setAttribute("title", "Cursos del usuario");
        newButton.innerHTML = blackboard.courseIcon();

        e.querySelectorAll("th")[0]
          .querySelectorAll("a")[0]
          .parentElement.parentElement.appendChild(organizationButton);
      });
    } catch (e) {
      blackboard.doCatch(e);
    }
  },
  getCoursesLinks: () => {
    try {
      if (!/execute\/userManager/.test(window.location.href)) {
        return false;
      }
      const trs = document.querySelectorAll("#listContainer_databody tr");

      trs.forEach((e) => {
        const organizationButton = document.createElement("a");

        const newButton = document.createElement("a");
        let h = e
          .querySelectorAll("th")[0]
          .querySelectorAll("span")[1]
          .getAttribute("bb:contextparameters");

        const arr = h.split("&enrollType=");
        h = arr[0].replace("course_id=&user_id=", "");
        let courses = `${base}/webapps/blackboard/execute/userEnrollment?nav_item=list_courses_by_user&group_type=Course&user_id=${h}`;
        let organization = `${base}/webapps/blackboard/execute/userEnrollment?nav_item=list_orgs_by_user&group_type=Organization&user_id=${h}`;

        newButton.setAttribute("href", courses);
        newButton.setAttribute("target", "_blank");
        newButton.setAttribute("style", "float:right");
        newButton.setAttribute("title", "Cursos del usuario");
        newButton.innerHTML = blackboard.courseIcon();

        organizationButton.setAttribute("href", organization);
        organizationButton.setAttribute("target", "_blank");
        organizationButton.setAttribute("style", "float:right");
        organizationButton.setAttribute("title", "Organizaciones del usuario");
        organizationButton.innerHTML = blackboard.organizationIcon();

        e.querySelectorAll("th")[0]
          .querySelectorAll("a")[0]
          .parentElement.parentElement.appendChild(organizationButton);

        e.querySelectorAll("th")[0]
          .querySelectorAll("a")[0]
          .parentElement.parentElement.appendChild(newButton);
      });
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  extractCourseId: function (param, path = null) {
    const href = path == null ? window.location.href : path;
    let url = new URL(href);
    let params = new URLSearchParams(url.search);
    const id = params.get(param);
    return id;
  },
  executeReport: function () {
    const h = window.location.href;
    const regex = /\/webapps\/blackboard\/execute\/courseEnrollment\?sortDir=ASCENDING&showAll=true&sourceType=COURSES&editPaging=false&course_id=/;
    if (regex.test(h)) {
      //saveJSON(getEnrollByCourse(), extractCourseId("course_id") + ".json");
    }
  },
  handleEnrollActivate: async (e) => {
    let response = {};
    try {
      debugger;
      const data = e.target.getAttribute("data-id").split("|");
      const email = data[0];
      const course = /_1/.test(data[1]) ? data[1] : `externalId:${data[1]}`;
      const options = {
        method: "patch",
        url: `/learn/api/public/v1/courses/${course}/users/userName:${email}`,
        headers: {
          headers: {
            "Content-type": "application/json",
          },
        },
        body: {
          availability: {
            available: "Yes",
          },
        },
      };
      response = await fetch(options.url, options);
      response = await response.json();
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  liveEvents: () => {
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
    });
  },
  onlyActiveAction: (e) => {
    try {
      document.querySelectorAll("#listContainer_databody tr").forEach((r) => {
        if (r.querySelector('img[alt*="eshabilitad"]')) {
          if (e.target.checked) {
            r.classList.add("d-none");
          } else {
            r.classList.remove("d-none");
          }
        }
      });
    } catch (error) {
      blackboard.doCatch(error);
    }
  },
  saveJSON: function (data, filename) {
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
  },
  toJSONString: function (form) {
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
  },
  runTasks: function () {
    if (/blackboard/.test(window.location.href)) {
      blackboard.addAuxiliarMenu();
      blackboard.addCoursesToCategoryUI();
      blackboard.getEnrollLink();
      blackboard.executeReport();
      blackboard.getCoursesLinks();
      blackboard.getDatesOfUsers();
      blackboard.getLastLogin();
      blackboard.liveEvents();
    }
  },
};

function blackboardFormAction(form) {
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
}

blackboard.runTasks();
