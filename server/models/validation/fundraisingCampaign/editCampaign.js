const getSchema = (prop) => {
  return schemas[prop];
};
const title = {
  id: "/title",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    title: { type: "string", minLength: 5, maxLength: 50 },
  },
  additionalProperties: false,
  required: ["title", "campaignId"],
};
const shortDescription = {
  id: "/shortDescription",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    shortDescription: { type: "string", minLength: 20, maxLength: 200 },
  },
  additionalProperties: false,
  required: ["shortDescription", "campaignId"],
};
const fullDescription = {
  id: "/fullDescription",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    fullDescription: { type: "string", minLength: 100, maxLength: 1500 },
  },
  additionalProperties: false,
  required: ["fullDescription", "campaignId"],
};
const value = {
  id: "/value",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    value: { type: "number", minimum: 20, maximum: 1000 },
  },
  additionalProperties: false,
  required: ["value", "campaignId"],
};
const paypalDonationURL = {
  id: "/paypalDonationURL",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    paypalDonationURL: {
      type: "string",
      pattern:
        /^https:\/\/(www.)?paypal\.com\/donate(\/)?\?hosted_button_id=[-a-zA-Z0-9@:%._\\+~#?&/=]{2,}$/,
    },
  },
  additionalProperties: false,
  required: ["paypalDonationURL", "campaignId"],
};
const mainPhotoDataURL = {
  id: "/mainPhotoDataURL",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    mainPhotoDataURL: {
      type: "string",
      pattern: "^data:([\\w/\\-\\.]+);(\\w+),(.*)$",
    },
    mainPhotoCrop: {
      x: { type: "number" },
      y: { type: "number" },
      width: { type: "number", minimum: 1 },
      height: { type: "number", minimum: 1 },
      required: ["x", "y", "width", "height"],
    },
  },
  additionalProperties: false,
  required: ["mainPhotoDataURL", "mainPhotoCrop", "campaignId"],
};
const documentsForPaymentDataURL = {
  id: "/documentsForPaymentDataURL",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    documentsForPaymentDataURL: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: { type: "string", pattern: "^data:([\\w/\\-\\.]+);(\\w+),(.*)$" },
    },
  },
  additionalProperties: false,
  required: ["documentsForPaymentDataURL", "campaignId"],
};
const photosDataURL = {
  id: "/photosDataURL",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    photosDataURL: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: { type: "string", pattern: "^data:([\\w/\\-\\.]+);(\\w+),(.*)$" },
    },
  },
  additionalProperties: false,
  required: ["photosDataURL", "campaignId"],
};
const schemas = Object.freeze({
  title,
  shortDescription,
  fullDescription,
  paypalDonationURL,
  value,
  mainPhotoDataURL,
  documentsForPaymentDataURL,
  photosDataURL,
});
module.exports = getSchema;
