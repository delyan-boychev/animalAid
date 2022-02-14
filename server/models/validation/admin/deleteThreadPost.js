const deleteThreadPostSchema = {
  id: "/deleteThreadPost",
  type: "object",
  properties: {
    threadId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    postId: { type: "string", pattern: "^[a-f\\d]{24}$" },
  },
  additionalProperties: false,
  required: ["threadId", "postId"],
};
module.exports = deleteThreadPostSchema;
