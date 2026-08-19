const driver = require("../config/database");

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Seeding database...");

    await session.run(`
      MERGE (d:Developer {id: "dev-001"})
      SET d.name = "Muhammad Isah",
          d.role = "Full Stack Developer",
          d.location = "Abuja, Nigeria"

      MERGE (s:Skill {id: "skill-javascript"})
      SET s.name = "JavaScript",
          s.category = "Programming Language"

      MERGE (d)-[:HAS_SKILL]->(s)

      MERGE (p:Project {id: "project-clinic"})
      SET p.name = "Clinic Appointment System",
          p.description = "A full-stack clinic appointment management system."

      MERGE (d)-[:BUILT]->(p)

      MERGE (t:Technology {id: "tech-express"})
      SET t.name = "Express.js",
          t.category = "Backend"

      MERGE (p)-[:USES]->(t)

      MERGE (d2:Developer {id: "dev-002"})
      SET d2.name = "Aisha Bello",
          d2.role = "Frontend Developer",
          d2.location = "Abuja, Nigeria"

      MERGE (d2)-[:HAS_SKILL]->(s)
    `);

    console.log("Database seeded successfully.");

  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();