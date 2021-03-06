async function run() {
  if (/blackboard/.test(window.location.href)) {
    ui.addSweetAlertLib();
    ui.addAuxiliarMenu();
    blackboard.addCoursesToCategoryUI();
    blackboard.getEnrollLink();
    blackboard.executeReport();
    blackboard.getCoursesLinks();
    blackboard.getDatesOfUsers();
    blackboard.getLastLogin();
    util.liveEvents();
    ui.addAnalytics();
    // blackboard.getSessions();
    // blackboard.updateSession();
    // await blackboard.findSessions();
  }
  // await blackboard.inactivateSessions();
}

run();
