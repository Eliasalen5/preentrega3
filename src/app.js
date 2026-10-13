import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";

const app = express();

app.use(express.json());

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;
