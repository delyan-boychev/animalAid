const changeProfilePhotoSchema = {
  id: "/changeProfilePhoto",
  type: "object",
  properties: {
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
  required: ["imgDataURL", "imageCrop"],
};
module.exports = changeProfilePhotoSchema;
