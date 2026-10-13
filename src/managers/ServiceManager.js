import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const servicesFilePath = path.join(__dirname, "..", "data", "services.json");

const requiredFields = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

class ServiceManager {
  async _readServices() {
    const data = await fs.readFile(servicesFilePath, "utf-8");
    return JSON.parse(data);
  }

  async _writeServices(services) {
    await fs.writeFile(servicesFilePath, JSON.stringify(services, null, 2));
  }

  async getServices(filters = {}) {
    const services = await this._readServices();
    const { category, available } = filters;

    let result = services;

    if (category !== undefined) {
      result = result.filter(
        (item) =>
          String(item.category).toLowerCase() === String(category).toLowerCase()
      );
    }

    if (available !== undefined) {
      const availableValue = String(available).toLowerCase() === "true";
      result = result.filter((item) => item.available === availableValue);
    }

    return result;
  }

  async getServiceById(id) {
    const services = await this._readServices();
    const service = services.find((item) => item.id === Number(id));
    return service ?? null;
  }

  async addService(serviceData) {
    if (!serviceData || typeof serviceData !== "object") {
      return null;
    }

    const missingFields = requiredFields.filter(
      (field) => serviceData[field] === undefined || serviceData[field] === null
    );

    if (missingFields.length > 0) {
      return null;
    }

    const services = await this._readServices();
    const nextId =
      services.length > 0 ? Math.max(...services.map((item) => item.id)) + 1 : 1;

    const newService = {
      id: nextId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };

    services.push(newService);
    await this._writeServices(services);
    return newService;
  }

  async updateService(id, updatedData) {
    const services = await this._readServices();
    const index = services.findIndex((item) => item.id === Number(id));

    if (index === -1) {
      return null;
    }

    const { id: _ignoredId, ...safeData } = updatedData ?? {};

    services[index] = {
      ...services[index],
      ...safeData,
      id: services[index].id,
    };

    await this._writeServices(services);
    return services[index];
  }

  async deleteService(id) {
    const services = await this._readServices();
    const index = services.findIndex((item) => item.id === Number(id));

    if (index === -1) {
      return null;
    }

    const [deletedService] = services.splice(index, 1);
    await this._writeServices(services);
    return deletedService;
  }
}

export default ServiceManager;
