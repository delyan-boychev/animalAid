const moderationVerifiedCampaignSchema = (body) => {
  let schema = {
    id: "/completeFundrisingCampaign",
    type: "object",
    properties: {
      campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
      verified: { type: "boolean" },
      rejectedComment: { type: "String", minLength: 10, maxLength: 100 },
    },
    additionalProperties: false,
    required: ["campaignId", "verified"],
  };
  if (body.verified === false) {
    schema.required.push("rejectedComment");
  }
  return schema;
};
module.exports = moderationVerifiedCampaignSchema;
