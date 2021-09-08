const changeEmailSchema =
{
    "id": "/changeEmail",
    "type": "object",
    "properties": {
        "password": {"type": "string", "minLength": 8, "maxLength": 98},
        "newEmail": {"type":"string", "format":"email"},
    },
    "additionalProperties": false,
    "required": [ "password", "newEmail"]
}
module.exports = changeEmailSchema;