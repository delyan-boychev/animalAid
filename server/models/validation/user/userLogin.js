const userLoginSchema = {
  id: "/userLogin",
  type: "object",
  properties: {
    password: { type: "string", minLength: 8, maxLength: 98 },
    email: { type: "string", format: "email" },
    captcha: {
      type: "string",
      pattern:
        "^[0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*]{6}$",
    },
    captchaCode: {
      type: "string",
      pattern:
        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$",
    },
  },
  additionalProperties: false,
  required: ["password", "email", "captcha", "captchaCode"],
};
module.exports = userLoginSchema;
