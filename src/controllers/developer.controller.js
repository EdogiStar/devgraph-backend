const driver = require("../config/database");

const {
  GET_DEVELOPER,
  GET_DEVELOPER_SKILLS,
  GET_DEVELOPER_PROJECTS,
  GET_DEVELOPER_TECHNOLOGIES,
  GET_SHARED_SKILLS
} = require("../queries/graph.queries");

async function getDeveloper(req, res) {
  const { id } = req.params;
  const session = driver.session();

  try {
    const developerResult = await session.run(
      GET_DEVELOPER,
      { developerId: id }
    );

    if (developerResult.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Developer not found"
      });
    }

    const skillsResult = await session.run(
      GET_DEVELOPER_SKILLS,
      { developerId: id }
    );

    const projectsResult = await session.run(
      GET_DEVELOPER_PROJECTS,
      { developerId: id }
    );

    const developer = developerResult.records[0]
      .get("d")
      .properties;

    const skills = skillsResult.records.map(
      (record) => record.get("s").properties
    );

    const projects = projectsResult.records.map(
      (record) => record.get("p").properties
    );

    res.json({
      success: true,
      data: {
        ...developer,
        skills,
        projects
      }
    });

  } catch (error) {
    console.error("Get developer error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve developer"
    });

  } finally {
    await session.close();
  }
}

async function getDeveloperTechnologies(req, res) {
  const { id } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(
      GET_DEVELOPER_TECHNOLOGIES,
      {
        developerId: id
      }
    );

    const technologies = result.records.map((record) => ({
      project: record.get("project"),
      technology: record.get("technology")
    }));

    res.json({
      success: true,
      data: technologies
    });

  } catch (error) {
    console.error("Get developer technologies error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve developer technologies"
    });

  } finally {
    await session.close();
  }
}

async function getDeveloperConnections(req, res) {
  const { id } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(
      GET_SHARED_SKILLS,
      {
        developerId: id
      }
    );

    const connections = result.records.map((record) => ({
      developer: record.get("developer"),
      sharedSkills: record.get("sharedSkills")
    }));

    res.json({
      success: true,
      data: connections
    });

  } catch (error) {
    console.error("Get developer connections error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve developer connections"
    });

  } finally {
    await session.close();
  }
}

module.exports = {
  getDeveloper,
  getDeveloperTechnologies,
  getDeveloperConnections
};