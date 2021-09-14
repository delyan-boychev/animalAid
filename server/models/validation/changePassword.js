const changePasswordSchema =
{
    "id": "/changePassword",
    "type": "object",
    "properties": {
        "oldPassword": {"type": "string", "minLength": 8, "maxLength": 98},
        "newPassword": {"type": "string", "minLength": 8, "maxLength": 98},
    },
    "additionalProperties": false,
    "required": [ "oldPassword", "newPassword"]
}
module.exports = changePasswordSchema;