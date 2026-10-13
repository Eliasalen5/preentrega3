import config from "./config/env.config.js";
import app from "./app.js";

app.listen(config.port, () => {
  console.log(
    `Servidor escuchando en http://localhost:${config.port} (entorno: ${config.nodeEnv})`
  );
});
