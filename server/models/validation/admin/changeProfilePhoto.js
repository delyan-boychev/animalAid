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
      width: { type: "number" },
      height: { type: "number" },
      required: ["x", "y", "width", "height"],
    },
  },
  additionalProperties: false,
  required: ["id", "imgDataURL", "imageCrop"],
};
module.exports = changeProfilePhotoSchema;
