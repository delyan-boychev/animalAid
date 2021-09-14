const forgotPasswordSchema =
{
    "id": "/forgotPassword",
    "type": "object",
    "properties": {
        "email": {"type":"string", "format":"email"}
    },
    "additionalProperties": false,
    "required": [ "email"]
}
module.exports = forgotPasswordSchema;