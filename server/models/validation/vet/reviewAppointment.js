const reviewAppointmentSchema = {
  id: "/reviewAppointment",
  type: "object",
  properties: {
    appointmentId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    rating: { type: "integer", minimum: 1, maximum: 5 },
    review: { type: "string", minLength: 20, maxLength: 150 },
  },
  additionalProperties: false,
  required: ["appointmentId", "rating", "review"],
};
module.exports = reviewAppointmentSchema;
