const changeProfilePhotoSchema = {
  id: "/changeProfilePhoto",
  type: "object",
  properties: {
    id: { type: "string", pattern: "^[a-f\\d]{24}$" },
    imgDataURL: {
      type: "string",
      pattern: "^data:([\\w/\\-\\.]+);(\\w+),(.*)$",
    },
    imageCrop: {
      x: { type: "number" },
      y: { type: "number" },
      width: { type: "number", minimum: 1 },
      height: { type: "number", minimum: 1 },
      required: ["x", "y", "width", "height"],
    },
  },
  additionalProperties: false,
  required: ["id", "imgDataURL", "imageCrop"],
};
module.exports = changeProfilePhotoSchema;
