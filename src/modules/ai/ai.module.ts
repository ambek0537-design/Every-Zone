import { Express } from "express";
import { aiRouter } from "./controllers/ai.controller";
import { AIFraudWorker } from "./workers";

export function registerAIModule(app: Express) {
  // Mount the AI Recommendation Engine routes under standard prefixes
  app.use("/", aiRouter);

  // Initialize background workers for ongoing fraud checks
  const fraudWorker = new AIFraudWorker();
  fraudWorker.startAutomatedFraudScans();

  console.log("🤖 [EVERY-ZONE AI RECOMMENDATION ENGINE] Modular APIs registered successfully.");
}
