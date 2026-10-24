import app = require("./app");
import migrations = require("./db/migrations");

const port = 3000;

async function startServer(): Promise<void> {
  try {
    await migrations.runMigrations();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to initialize the database.", error);
    process.exitCode = 1;
  }
}

void startServer();
