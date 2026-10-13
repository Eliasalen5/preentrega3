import "dotenv/config";

const requiredVariables = ["PORT", "NODE_ENV"];

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Faltan variables de entorno requeridas: ${missingVariables.join(", ")}. ` +
      "Revisá tu archivo .env (podés basarte en .env.example)."
  );
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};

export default config;
