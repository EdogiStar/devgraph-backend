const driver = require("../config/database");

const developers = [
  {
    id: "dev-001",
    name: "Muhammad Isah",
    role: "Full Stack Developer",
    location: "Abuja, Nigeria",
    skills: ["skill-javascript", "skill-react", "skill-node", "skill-sql"]
  },
  {
    id: "dev-002",
    name: "Aisha Bello",
    role: "Frontend Developer",
    location: "Abuja, Nigeria",
    skills: ["skill-javascript", "skill-react", "skill-tailwind", "skill-uiux"]
  },
  {
    id: "dev-003",
    name: "David Okafor",
    role: "Backend Developer",
    location: "Lagos, Nigeria",
    skills: ["skill-javascript", "skill-node", "skill-express", "skill-postgresql"]
  },
  {
    id: "dev-004",
    name: "Fatima Ibrahim",
    role: "Python Developer",
    location: "Kano, Nigeria",
    skills: ["skill-python", "skill-fastapi", "skill-sql", "skill-docker"]
  },
  {
    id: "dev-005",
    name: "Daniel Adeyemi",
    role: "DevOps Engineer",
    location: "Lagos, Nigeria",
    skills: ["skill-docker", "skill-git", "skill-aws", "skill-linux"]
  },
  {
    id: "dev-006",
    name: "Maryam Yusuf",
    role: "Full Stack Developer",
    location: "Kaduna, Nigeria",
    skills: ["skill-javascript", "skill-react", "skill-node", "skill-postgresql"]
  },
  {
    id: "dev-007",
    name: "Chinedu Eze",
    role: "Data Engineer",
    location: "Enugu, Nigeria",
    skills: ["skill-python", "skill-sql", "skill-postgresql", "skill-docker"]
  },
  {
    id: "dev-008",
    name: "Zainab Musa",
    role: "Frontend Developer",
    location: "Abuja, Nigeria",
    skills: ["skill-react", "skill-tailwind", "skill-javascript", "skill-uiux"]
  }
];

const skills = [
  ["skill-javascript", "JavaScript", "Programming Language"],
  ["skill-react", "React", "Frontend"],
  ["skill-node", "Node.js", "Backend"],
  ["skill-sql", "SQL", "Database"],
  ["skill-tailwind", "TailwindCSS", "Frontend"],
  ["skill-uiux", "UI/UX Design", "Design"],
  ["skill-express", "Express.js", "Backend"],
  ["skill-postgresql", "PostgreSQL", "Database"],
  ["skill-python", "Python", "Programming Language"],
  ["skill-fastapi", "FastAPI", "Backend"],
  ["skill-docker", "Docker", "DevOps"],
  ["skill-git", "Git", "Development Tool"],
  ["skill-aws", "AWS", "Cloud"],
  ["skill-linux", "Linux", "Operating System"]
];

const technologies = [
  ["tech-express", "Express.js", "Backend"],
  ["tech-react", "React", "Frontend"],
  ["tech-node", "Node.js", "Backend"],
  ["tech-postgresql", "PostgreSQL", "Database"],
  ["tech-tailwind", "TailwindCSS", "Frontend"],
  ["tech-fastapi", "FastAPI", "Backend"],
  ["tech-docker", "Docker", "DevOps"],
  ["tech-aws", "AWS", "Cloud"],
  ["tech-python", "Python", "Programming Language"],
  ["tech-vite", "Vite", "Frontend Tooling"]
];

const projects = [
  {
    id: "project-clinic",
    name: "Clinic Appointment System",
    description: "A full-stack clinic appointment management system.",
    developerId: "dev-001",
    technologies: ["tech-express", "tech-react", "tech-postgresql"]
  },
  {
    id: "project-ecommerce",
    name: "MiniStore",
    description: "A modern e-commerce application for browsing and managing products.",
    developerId: "dev-002",
    technologies: ["tech-react", "tech-tailwind", "tech-vite"]
  },
  {
    id: "project-api",
    name: "Developer API Platform",
    description: "A REST API for managing developer profiles and projects.",
    developerId: "dev-003",
    technologies: ["tech-node", "tech-express", "tech-postgresql"]
  },
  {
    id: "project-ml-api",
    name: "Disease Prediction API",
    description: "A machine learning API that predicts diseases from reported symptoms.",
    developerId: "dev-004",
    technologies: ["tech-python", "tech-fastapi", "tech-docker"]
  },
  {
    id: "project-cloud",
    name: "Cloud Deployment Platform",
    description: "A deployment workflow for containerized web applications.",
    developerId: "dev-005",
    technologies: ["tech-docker", "tech-aws"]
  },
  {
    id: "project-jobboard",
    name: "HireNest",
    description: "A job board application connecting developers with opportunities.",
    developerId: "dev-006",
    technologies: ["tech-react", "tech-node", "tech-postgresql"]
  },
  {
    id: "project-data",
    name: "Data Analytics Dashboard",
    description: "A dashboard for exploring and visualizing structured business data.",
    developerId: "dev-007",
    technologies: ["tech-python", "tech-postgresql", "tech-docker"]
  },
  {
    id: "project-portfolio",
    name: "Developer Portfolio",
    description: "A responsive portfolio website showcasing projects and technical skills.",
    developerId: "dev-008",
    technologies: ["tech-react", "tech-tailwind", "tech-vite"]
  }
];

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Seeding CognoDB...");

    // Create skills
    await session.run(
      `
      UNWIND $skills AS skill
      MERGE (s:Skill {id: skill.id})
      SET s.name = skill.name,
          s.category = skill.category
      `,
      {
        skills: skills.map(([id, name, category]) => ({
          id,
          name,
          category
        }))
      }
    );

    // Create technologies
    await session.run(
      `
      UNWIND $technologies AS technology
      MERGE (t:Technology {id: technology.id})
      SET t.name = technology.name,
          t.category = technology.category
      `,
      {
        technologies: technologies.map(([id, name, category]) => ({
          id,
          name,
          category
        }))
      }
    );

    // Create developers and their skills
    await session.run(
      `
      UNWIND $developers AS developer
      MERGE (d:Developer {id: developer.id})
      SET d.name = developer.name,
          d.role = developer.role,
          d.location = developer.location

      WITH d, developer
      UNWIND developer.skills AS skillId
      MATCH (s:Skill {id: skillId})
      MERGE (d)-[:HAS_SKILL]->(s)
      `,
      { developers }
    );

    // Create projects and relationships
    await session.run(
      `
      UNWIND $projects AS project
      MATCH (d:Developer {id: project.developerId})

      MERGE (p:Project {id: project.id})
      SET p.name = project.name,
          p.description = project.description

      MERGE (d)-[:BUILT]->(p)

      WITH p, project
      UNWIND project.technologies AS technologyId
      MATCH (t:Technology {id: technologyId})
      MERGE (p)-[:USES]->(t)
      `,
      { projects }
    );

    console.log("Database seeded successfully.");
    console.log("Developers:", developers.length);
    console.log("Skills:", skills.length);
    console.log("Projects:", projects.length);
    console.log("Technologies:", technologies.length);

  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();