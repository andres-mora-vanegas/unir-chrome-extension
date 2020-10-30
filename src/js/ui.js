const ui = {};

ui.usersIcon = () => {
  return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAklEQVQ4T83TMSvFURgG8N9dxCKFzWZRkmwGizIQXcXiE7iYJSnfwWShJCmTUclCDCZhkZkNhcVyi95/R53+kXKX+9YZzjk9z/s8z3lPRYNVaRCvuQjWsI4LVDGFTQqVizjDPTpwjPGwn1v4QGvKZBK76Er7Z2xjNcuswOYEJxjDO/pxhe4EeMIMztP+5Zs8J2jDKG7xiNnMwgIOMZykb+C1rKAPA4hukUO99MQtWEJPyiAUFxZiRVjRJSoURGgjGMQnbvCAnSynawwFeAJHCXyHFeyjvaTgDfPYQ6iJWg6C3uQ9Di5xis5fJjReo4bpdL/10yQe/DHec/l9c43yvz7mF8dpLMC3tJ3tAAAAAElFTkSuQmCC" />`;
};
ui.organizationIcon = () => {
  return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmElEQVQ4T+3TsQkCQRCF4e9C7cMqDCxCBVEj+7jAUjQRRQRjC7AKy1ATAznYNThZbo8zdLJl5v3MzrwpdIwioR+gRD/kH1jjVq9PAbYY4RoEQ1ywygUc8cIsCOrvDyd2MMUGvcyRPLHEKQIOqCBtYod5BFQtjtuosa+++Af8cAad1zgJRoreb9roHQucU7fQBPiycragXvgGr1wgEdi2CvkAAAAASUVORK5CYII=" />`;
};
ui.courseIcon = () => {
  return `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA90lEQVQ4T6XTuy4EYRjG8d/agkpQULoDcS9IhCsQh0Ihcaocit1yFzdAIXEhSuIOqDRER+GQNz6bL2t2jMyUk+/7P/P833caaj6NmveVAWbRSgFbuCkKKwJM4whL9AI+cYFd3OegHDCRDqxieEC1N3RTwHOcCcAINrCNsYpO4vIxOj+Adez8EzAeNfMK8SI6rv1RoZPSn7DQL3EGLzjEcibxI0ncxyjuEGJ/Aa4whRA51DfG0HOCByyWAebwjlNEYnzlAVbQxGUZIGS2MwePCTCZpvOKTZxhHteDFqnIwTn2UoXetKuscsiKVb6tusoVd+n7WO2/8QulMjHdyCMI0QAAAABJRU5ErkJggg==" />`;
};

ui.mainMenuItem = function (link, text, icon) {
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
};

ui.addLinksToMainUltra = function () {
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
};

ui.addAuxiliarMenu = function () {
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
};

ui.addAnalytics = () => {
  setTimeout(() => {
    try {
      const nav = document.querySelector(
        ".course-analytics__view-tabs.analytics-tools.button-group"
      );
      if (nav && nav.querySelector(".userAnalytics") == null) {
        const li = document.createElement("li");
        li.innerHTML = `
            <a class="button super-clear course-tool-tab js-question-analysis-tab userAnalytics" >Análisis de usuarios</a>
            
            `;
        nav.appendChild(li);
      }
    } catch (error) {
      util.doCatch(error);
    }
  }, 2000);
};

ui.printAnalytics = () => {
  try {
  } catch (error) {
    util.doCatch(error);
  }
};

ui.addSweetAlertLib = () => {
  try {
    const swetscrp = document.createElement("script");
    swetscrp.setAttribute(
      "src",
      "https://unpkg.com/sweetalert/dist/sweetalert.min.js"
    );
    document.body.appendChild(swetscrp);
  } catch (error) {}
};
