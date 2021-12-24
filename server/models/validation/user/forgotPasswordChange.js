const forgotPasswordChangeSchema =
{
    "id": "/forgotPasswordChange",
    "type": "object",
    "properties": {
        "newPassword": {"type": "string", "minLength": 8, "maxLength": 98},
        "token": {"type": "string", "minLength": 8}
    },
    "additionalProperties": false,
    "required": [ "newPassword"]
}
module.exports = forgotPasswordChangeSchema;