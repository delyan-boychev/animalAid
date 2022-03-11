const confirmAppointmentSchema = {
  id: "/confirmAppointment",
  type: "object",
  properties: {
    appointmentId: { type: "string", pattern: "^[a-f\\d]{24}$" },
  },
  additionalProperties: false,
  required: ["appointmentId"],
};
module.exports = confirmAppointmentSchema;
