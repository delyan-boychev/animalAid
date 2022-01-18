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
      width: { type: "number" },
      height: { type: "number" },
      required: ["x", "y", "width", "height"],
    },
  },
  additionalProperties: false,
  required: ["imgDataURL", "imageCrop"],
};
module.exports = changeProfilePhotoSchema;
