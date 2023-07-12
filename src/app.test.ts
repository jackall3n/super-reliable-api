import request from "supertest";
import app from "./app";

// Mocking queue as it was causing issues with jest.
jest.mock("./queues/readings.queue", () => ({
  addReadingsToQueue: jest.fn(),
}));

describe("readings", () => {
  describe("GET", () => {
    it("should ensure from is supplied", async () => {
      const response = await request(app).get("/data");

      expect(response.body.error).toEqual("from is not defined");
    });

    it("should ensure to is supplied", async () => {
      const response = await request(app).get("/data?from=2023-01-01");

      expect(response.body.error).toEqual("to is not defined");
    });

    it("should return an array of readings with power readings", async () => {
      const response = await request(app).get(
        "/data?from=2022-10-14&to=2022-10-15",
      );

      const readings = response.body;

      expect(readings[0]).toEqual({
        name: "Voltage",
        time: "2022-10-14T11:00:00.000Z",
        value: 20,
      });

      expect(readings[1]).toEqual({
        name: "Current",
        time: "2022-10-14T15:00:00.000Z",
        value: 10,
      });

      expect(readings[2]).toEqual({
        name: "Power",
        time: "2022-10-14T00:00:00.000Z",
        value: 200,
      });
    });
  });

  describe("POST", () => {
    it("should accept valid data", async () => {
      const response = await request(app)
        .post("/data")
        .set("Content-Type", "text/plain").send(`1649941817 Voltage 1.34
1649941818 Voltage 1.35
1649941817 Current 12.0
1649941818 Current 14.0`);

      expect(response.body.success).toEqual(true);
    });

    it("should validate malformed data", async () => {
      const response = await request(app)
        .post("/data")
        .set("Content-Type", "text/plain").send(`1649941817 Voltage 1.34
1649941818 1.35 Voltage`);

      expect(response.body).toEqual({
        error: "readings[1] is invalid: value must be a number",
        success: false,
      });
    });

    it("should validate malformed metric value", async () => {
      const response = await request(app)
        .post("/data")
        .set("Content-Type", "text/plain").send(`1649941817 Resistance 1.34`);

      expect(response.body).toEqual({
        error: "readings[0] is invalid: name must be one of the following values: Voltage, Current",
        success: false,
      });
    });
  });
});
