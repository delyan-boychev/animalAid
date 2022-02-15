const createFundrisingCampaignSchema = {
  id: "/createFundrisingCampaign",
  type: "object",
  properties: {
    title: { type: "string", minLength: 5, maxLength: 50 },
    shortDescription: { type: "string", minLength: 20, maxLength: 100 },
    fullDescription: { type: "string", minLength: 50, maxLength: 1500 },
    value: { type: "number", minimum: 20, maximum: 1000 },
    paypalDonationURL: {
      type: "string",
      pattern:
        /^https:\/\/(www.)?paypal\.com\/donate\/\?hosted_button_id=[-a-zA-Z0-9@:%._\\+~#?&/=]{2,}$/,
    },
    mainPhotoDataURL: {
      type: "string",
      pattern: "^data:([\\w/\\-\\.]+);(\\w+),(.*)$",
    },
    photosDataURL: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: { type: "string", pattern: "^data:([\\w/\\-\\.]+);(\\w+),(.*)$" },
    },
  },
  additionalProperties: false,
  required: [
    "title",
    "shortDescription",
    "fullDescription",
    "value",
    "paypalDonationURL",
    "mainPhotoDataURL",
    "photosDataURL",
  ],
};
module.exports = createFundrisingCampaignSchema;
