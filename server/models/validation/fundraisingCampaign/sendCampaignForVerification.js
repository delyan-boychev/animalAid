const sendCampaignForVerificationSchema = {
  id: "/sendCampaignForVerification",
  type: "object",
  properties: {
    campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
  },
  additionalProperties: false,
  required: ["campaignId"],
};
module.exports = sendCampaignForVerificationSchema;
