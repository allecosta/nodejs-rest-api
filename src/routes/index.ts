import { Application } from "express";
import tutorialRoutes from "./tutorialRoutes";
import homeRoutes from "./homeRoutes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/tutorials", tutorialRoutes);
  }
}
