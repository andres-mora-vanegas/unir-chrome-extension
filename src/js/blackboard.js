blackboard.validCategoryCourses = async function () {
  let response = [];
  try {
    const href = window.location.href;
    let url = new URL(href);
    let params = new URLSearchParams(url.search);
    const id = params.get("current_cat_id");
    if (/catalogMgr/.test(href) && id != null) {
      const coursesByCategory = await util.getCoursesByCategory(id);
      if (coursesByCategory != null && coursesByCategory.results.length > 0) {
        for (const item of coursesByCategory.results) {
          const course = await api.getCoursesById(item.courseId);
          response.push(course);
        }
      }
    }
  } catch (error) {
    util.doCatch(error);
  }
  return response;
};

blackboard.addCoursesToCategoryUI = async function () {
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
    util.doCatch(error);
  }
};

blackboard.getUsersBlackboard = function () {
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
        email: e.querySelector("td:nth-child(6)").querySelector("a").innerHTML,
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
    util.doCatch(error);
  }
};

blackboard.getDatesOfUsers = async () => {
  try {
    if (/userManager\?course_id=/.test(window.location.href)) {
      const dataBody = document.querySelectorAll("#listContainer_databody tr");
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
          const response = await api.getDates(username);

          const createdData = document.createElement("td");
          const modifiedData = document.createElement("td");
          const lastLoginData = document.createElement("td");

          createdData.innerHTML = `<a>${util.formatDate(response.created)}</a>`;
          modifiedData.innerHTML = `<a>${util.formatDate(
            response.modified
          )}</a>`;
          lastLoginData.innerHTML = `<a>${util.formatDate(
            response.lastLogin
          )}</a>`;

          tr.appendChild(lastLoginData);
          tr.appendChild(createdData);
          tr.appendChild(modifiedData);
        }
      }
    }
  } catch (error) {
    util.doCatch(error);
  }
};

blackboard.getLastLogin = async () => {
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

      const dataBody = document.querySelectorAll("#listContainer_databody tr");
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
        if (course) {
          const tempCourse = course != null ? course : userId;
          const usersInfo = await api.getUsersByCourse(tempCourse);
        }
        for (const tr of dataBody) {
          const username =
            userId == null ? tr.querySelector("th").innerText.trim() : email;
          const inp = tr.querySelector("td input");
          const userId_ = inp != null ? "_" + inp.value + "_1" : "";
          course =
            userId == null
              ? course
              : tr
                  .querySelectorAll("td")[1]
                  .querySelector(".table-data-cell-value")
                  .innerText.trim();
          const external = userId != null ? true : false;
          let response = [];
          if (userId_ === "") {
            response = await api.getLastLoginInfo(course, username, external);
          } else {
            response = usersInfo.results.find((x) => x.userId == userId_);
          }

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

          createdData.innerHTML = `<a>${util.formatDate(response.created)}</a>`;
          modifiedData.innerHTML = `<a>${util.formatDate(
            response.modified
          )}</a>`;
          lastLoginData.innerHTML = `<a>${util.formatDate(
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
    util.doCatch(error);
  }
};
blackboard.addOnlyActive = () => {
  try {
    const titleDiv = document.querySelector("#pageTitleDiv");
    const check = document.createElement("div");
    check.setAttribute("class", "float-right");
    check.innerHTML = `<label for="onlyActive">Solo activos </label><input type="checkbox" id="onlyActive" class="onlyActive">`;
    titleDiv.appendChild(check);
  } catch (error) {
    util.doCatch(error);
  }
};

blackboard.generateFile = function (data) {
  const a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(
    new Blob(data, { type: "application/json" })
  );
  a.download = blackboard.extractCourseId() + ".json";

  // Append anchor to body.
  document.body.appendChild(a);
  a.click();
};
blackboard.getEnrollByCourse = function () {
  const users = [];
  try {
    console.log(`util`, util);
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
  } catch (error) {
    util.doCatch(error);
  }

  return users;
};
blackboard.getEnrollLink = function () {
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

      newButton.innerHTML = ui.usersIcon();
      e.querySelectorAll("td")[1]
        .querySelectorAll("a")[0]
        .parentElement.parentElement.appendChild(newButton);
    });
  } catch (e) {
    util.doCatch(e);
  }
};

blackboard.getUserLinkFromEnroll = function () {
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
      newButton.innerHTML = ui.courseIcon();

      e.querySelectorAll("th")[0]
        .querySelectorAll("a")[0]
        .parentElement.parentElement.appendChild(organizationButton);
    });
  } catch (e) {
    util.doCatch(e);
  }
};
blackboard.getCoursesLinks = () => {
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
      newButton.innerHTML = ui.courseIcon();

      organizationButton.setAttribute("href", organization);
      organizationButton.setAttribute("target", "_blank");
      organizationButton.setAttribute("style", "float:right");
      organizationButton.setAttribute("title", "Organizaciones del usuario");
      organizationButton.innerHTML = ui.organizationIcon();

      e.querySelectorAll("th")[0]
        .querySelectorAll("a")[0]
        .parentElement.parentElement.appendChild(organizationButton);

      e.querySelectorAll("th")[0]
        .querySelectorAll("a")[0]
        .parentElement.parentElement.appendChild(newButton);
    });
  } catch (error) {
    util.doCatch(error);
  }
};

blackboard.extractCourseId = function (param, path = null) {
  const href = path == null ? window.location.href : path;
  let url = new URL(href);
  let params = new URLSearchParams(url.search);
  const id = params.get(param);
  return id;
};
blackboard.executeReport = function () {
  const h = window.location.href;
  const regex = /\/webapps\/blackboard\/execute\/courseEnrollment\?sortDir=ASCENDING&showAll=true&sourceType=COURSES&editPaging=false&course_id=/;
  if (regex.test(h)) {
    //saveJSON(getEnrollByCourse(), extractCourseId("course_id") + ".json");
  }
};
blackboard.handleEnrollActivate = async (e) => {
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
    util.doCatch(error);
  }
};

blackboard.onlyActiveAction = (e) => {
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
    util.doCatch(error);
  }
};
blackboard.getCourseAnalytics = async (e) => {
  try {
    const href = window.location.href;
    let courseId = href.match(/\/courses\/(.*?)\/analytics/);
    document.querySelector(".view-container").innerHTML = "Cargando...";

    const users = await api.getUsersByCourse(courseId[1]);
    console.log(`users`, users);
    const rgx = new RegExp("_(.*?)_1");
    courseId = courseId[1].match(rgx);
    if (courseId.length > 0) {
      const response = await api.getCourseAnalytics(courseId[1]);
      if (response.state && response.result && response.result.length > 0) {
        const content = document.createElement("div");
        content.innerHTML = `
        <h1>Usuarios del curso</h1>
        <table id="analyticsDetail">
        <thead style="text-align:left;">
          <tr style="border-bottom:1px solid #ccc;border-top:1px solid #ccc">
            <th style="padding:15px 0px">Estudiante</th>
            <th>Email</th>
            <th>Último acceso</th>
            <th>Fecha de inscripción</th>
            <th>Fecha de cambio de la matrícula</th>
            <th>Detalle</th>
          </tr>
          </thead>
          
            `;
        let body = ``;
        for (const user of users.results) {
          body += `
          <tr style="border-bottom:1px solid #ccc">
          <td style="padding:15px 0px">${user.user.name.given} ${
            user.user.name.family
          }</td>
          <td style="padding:15px 0px">${user.user.contact.email}</td>
          <td style="padding:15px 0px">${util.formatDate(
            user.lastAccessed
          )}</td>
          <td style="padding:15px 0px">${util.formatDate(user.created)}</td>
          <td style="padding:15px 0px">${util.formatDate(user.modified)}</td>
          <td style="padding:15px 0px"><a class="viewAnalyticDetail" data-id="${user.user.id
            .substring(1)
            .replace("_1", "")}" data-info='${JSON.stringify(
            response
          )}'>Ver</a></td>
          </tr>`;
        }
        content.innerHTML += `<tbody></tbody></table>`;
        document.querySelector(".view-container").innerHTML = "";
        document.querySelector(".view-container").append(content);
        // window["swal"]({ content });
        const bd = document.createElement("tbody");
        bd.innerHTML = body;
        const analyticsDetail = document.querySelector("#analyticsDetail");
        analyticsDetail.appendChild(bd);
        analyticsDetail.style.width = "100%";
      }
    }
  } catch (error) {
    util.doCatch(error);
  }
};
blackboard.getCourseAnalyticsDetail = async (e) => {
  try {
    const id = e.target.getAttribute("data-id");
    const dataInfo = JSON.parse(e.target.getAttribute("data-info")).result;

    const filtered = dataInfo.filter((x) => x.SOURCEID == id);
    const unique = [];
    for (const item of filtered) {
      const idx = unique.findIndex((x) => x.id == item.ACTIVITY) === -1;
      if (idx) {
        unique.push({ id: item.ACTIVITY, count: 0 });
      }
    }
    let auto = 0;
    for (const u of unique) {
      let sum = 0;
      for (const f of filtered) {
        if (f.ACTIVITY == u.id) {
          sum += f.CLICKS;
        }
      }
      unique[auto].count = sum;
      auto++;
    }
    unique.sort((a, b) => (a.count < b.count ? 1 : -1));

    if (unique.length > 0) {
      const content = document.createElement("div");
      content.innerHTML = `
        <h1>Acceso a los recursos de ${filtered[0].NAMES} ${filtered[0].LASTNAME}</h1>
        <table id="analyticsDetailClicks">
        <thead style="text-align:left;">
          <tr style="border-bottom:1px solid #ccc;border-top:1px solid #ccc">
            <th style="padding:15px 0px">Recurso</th>
            <th>Accesos</th>
          </tr>
          </thead>

            `;
      let body = ``;
      for (const u of unique) {
        body += `
          <tr style="border-bottom:1px solid #ccc">
          <td style="padding:15px 0px">${u.id}</td>
          <td style="padding:15px 0px">${u.count}</td>          
          </tr>`;
      }
      content.innerHTML += `<tbody></tbody></table>`;
      document.querySelector(".view-container").innerHTML = "";
      document.querySelector(".view-container").appendChild(content);
      // window["swal"]({ content });
      const bd = document.createElement("tbody");
      bd.innerHTML = body;
      const analyticsDetail = document.querySelector("#analyticsDetailClicks");
      analyticsDetail.appendChild(bd);
      analyticsDetail.style.width = "100%";
    }
  } catch (error) {
    util.doCatch(error);
  }
};
