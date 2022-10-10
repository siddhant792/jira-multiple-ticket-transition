const core = require("@actions/core");
const App = require("./src/app");

try {
  const app = new App();
  app.run();
} catch (error) {
  core.setFailed(error.toString());
}
