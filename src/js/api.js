api.getDates = async (email) => {
  try {
    const url = `/learn/api/public/v1/users/userName:${email}?fields=created,modified,lastLogin`;
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (error) {
    util.doCatch(error);
  }
};

api.getCoursesByCategory = async (category) => {
  const url = `/learn/api/public/v1/catalog/categories/course/${category}/courses`;
  let response = await fetch(url);
  response = await response.json();
  return response;
};
api.getCoursesById = async (courseId) => {
  const url = `/learn/api/public/v2/courses/${courseId}`;
  let response = await fetch(url);
  response = await response.json();
  return response;
};

api.getLastLoginInfo = async (course, email, external = false) => {
  try {
    course = external ? `externalId:${course}` : course;

    const url =
      master_link +
      `/learn/api/public/v1/courses/${course}/users/userName:${email}?fields=created,modified,lastAccessed`;
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (error) {
    util.doCatch(error);
  }
};

api.getUsersByCourse = async (course) => {
  try {
    const url =
      master_link + `/learn/api/public/v1/courses/${course}/users?expand=user`;
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (error) {
    util.doCatch(error);
  }
};

api.getCourseAnalytics = async (course) => {
  try {
    const url = `https://us-central1-virtual-ucentral.cloudfunctions.net/bbdataquery`;
    const data = {
      query: "activityDetailByCourse",
      id: course,
    };
    const opt = {
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
    };
    let response = await fetch(url, opt);
    response = await response.json();
    return response;
  } catch (error) {
    util.doCatch(error);
  }
};
