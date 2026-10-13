import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bookingsFilePath = path.join(__dirname, "..", "data", "bookings.json");

const requiredFields = ["clientName", "clientEmail", "date", "time", "status"];

class BookingManager {
  async _readBookings() {
    const data = await fs.readFile(bookingsFilePath, "utf-8");
    return JSON.parse(data);
  }

  async _writeBookings(bookings) {
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2));
  }

  async createBooking(bookingData) {
    if (!bookingData || typeof bookingData !== "object") {
      return null;
    }

    const missingFields = requiredFields.filter(
      (field) =>
        bookingData[field] === undefined ||
        bookingData[field] === null ||
        bookingData[field] === ""
    );

    if (missingFields.length > 0) {
      return null;
    }

    const bookings = await this._readBookings();
    const nextId =
      bookings.length > 0 ? Math.max(...bookings.map((item) => item.id)) + 1 : 1;

    const services = Array.isArray(bookingData.services)
      ? bookingData.services.map((item) => ({
          service: Number(item.service),
          quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        }))
      : [];

    const newBooking = {
      id: nextId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services,
    };

    bookings.push(newBooking);
    await this._writeBookings(bookings);
    return newBooking;
  }

  async getBookingById(id) {
    const bookings = await this._readBookings();
    const booking = bookings.find((item) => item.id === Number(id));
    return booking ?? null;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this._readBookings();
    const index = bookings.findIndex((item) => item.id === Number(bookingId));

    if (index === -1) {
      return null;
    }

    const numericServiceId = Number(serviceId);
    const existingService = bookings[index].services.find(
      (item) => item.service === numericServiceId
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      bookings[index].services.push({
        service: numericServiceId,
        quantity: 1,
      });
    }

    await this._writeBookings(bookings);
    return bookings[index];
  }
}

export default BookingManager;
