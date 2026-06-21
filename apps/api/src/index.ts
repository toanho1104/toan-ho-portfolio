import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth.route";

const app = new Elysia()
  .use(cors())
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(authRoutes);

app.listen(process.env.PORT ?? 3001);

console.log(`API running at http://localhost:${app.server?.port}`);
