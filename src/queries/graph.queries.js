const GET_DEVELOPER = `
  MATCH (d:Developer {id: $developerId})
  RETURN d
`;

const GET_DEVELOPER_SKILLS = `
  MATCH (d:Developer {id: $developerId})
        -[:HAS_SKILL]->
        (s:Skill)
  RETURN s
  ORDER BY s.name
`;

const GET_DEVELOPER_PROJECTS = `
  MATCH (d:Developer {id: $developerId})
        -[:BUILT]->
        (p:Project)
  RETURN p
  ORDER BY p.name
`;

const GET_PROJECT_TECHNOLOGIES = `
  MATCH (p:Project {id: $projectId})
        -[:USES]->
        (t:Technology)
  RETURN t
  ORDER BY t.name
`;

const GET_DEVELOPER_TECHNOLOGIES = `
  MATCH (d:Developer {id: $developerId})
        -[:BUILT]->
        (p:Project)
        -[:USES]->
        (t:Technology)
  RETURN p.name AS project,
         t.name AS technology
  ORDER BY p.name, t.name
`;

const GET_SHARED_SKILLS = `
  MATCH (d1:Developer {id: $developerId})
        -[:HAS_SKILL]->
        (s:Skill)
        <-[:HAS_SKILL]-
        (d2:Developer)

  WHERE d1 <> d2

  RETURN d2.name AS developer,
         collect(s.name) AS sharedSkills
  ORDER BY d2.name
`;

const GET_ALL_DEVELOPERS = `
  MATCH (d:Developer)
  RETURN d
  ORDER BY d.name
`;

const GET_GRAPH_STATS = `
  CALL {
    MATCH (d:Developer)
    RETURN count(d) AS developers
  }
  CALL {
    MATCH (p:Project)
    RETURN count(p) AS projects
  }
  CALL {
    MATCH (s:Skill)
    RETURN count(s) AS skills
  }
  CALL {
    MATCH (t:Technology)
    RETURN count(t) AS technologies
  }
  RETURN developers, projects, skills, technologies
`;

module.exports = {
  GET_DEVELOPER,
  GET_DEVELOPER_SKILLS,
  GET_DEVELOPER_PROJECTS,
  GET_PROJECT_TECHNOLOGIES,
  GET_DEVELOPER_TECHNOLOGIES,
  GET_SHARED_SKILLS,
  GET_ALL_DEVELOPERS,
  GET_GRAPH_STATS
};