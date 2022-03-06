const moderationVerifiedCampaignSchema = (body) => {
  let schema = {
    id: "/moderationVerifyFundrisingCampaign",
    type: "object",
    properties: {
      campaignId: { type: "string", pattern: "^[a-f\\d]{24}$" },
      verified: { type: "boolean" },
      rejectedComment: { type: "String", minLength: 10, maxLength: 130 },
    },
    additionalProperties: false,
    required: ["campaignId", "verified"],
  };
  if (body.verified === false) {
    schema.required.push("rejectedComment");
  } else {
    delete schema.properties.rejectedComment;
  }
  return schema;
};
module.exports = moderationVerifiedCampaignSchema;
