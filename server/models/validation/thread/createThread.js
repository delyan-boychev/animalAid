const createThreadSchema = {
  id: "/createThread",
  type: "object",
  properties: {
    topic: { type: "string", minLength: 5, maxLength: 100 },
    description: { type: "string", minLength: 50, maxLength: 4000 },
  },
  additionalProperties: false,
  required: ["topic", "description"],
};
module.exports = createThreadSchema;
