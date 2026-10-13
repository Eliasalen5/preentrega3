import { Router } from "express";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();
const serviceManager = new ServiceManager();

router.get("/", async (req, res) => {
  const services = await serviceManager.getServices(req.query);
  res.status(200).json(services);
});

router.get("/:sid", async (req, res) => {
  const { sid } = req.params;
  const service = await serviceManager.getServiceById(sid);

  if (!service) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  res.status(200).json(service);
});

router.post("/", async (req, res) => {
  const createdService = await serviceManager.addService(req.body);

  if (!createdService) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios (name, description, duration, price, category, available)",
    });
  }

  res.status(201).json(createdService);
});

router.put("/:sid", async (req, res) => {
  const { sid } = req.params;
  const updatedService = await serviceManager.updateService(sid, req.body);

  if (!updatedService) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  res.status(200).json(updatedService);
});

router.delete("/:sid", async (req, res) => {
  const { sid } = req.params;
  const deletedService = await serviceManager.deleteService(sid);

  if (!deletedService) {
    return res
      .status(404)
      .json({ error: `No existe un servicio con id ${sid}` });
  }

  res.status(200).json(deletedService);
});

export default router;
