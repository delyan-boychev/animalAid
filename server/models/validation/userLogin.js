const userLoginSchema =
{
    "id": "/userLogin",
    "type": "object",
    "properties": {
        "password": {"type": "string", "minLength": 8, "maxLength": 98},
        "email": {"type":"string", "format":"email"},
    },
    "additionalProperties": false,
    "required": [ "password", "email"]
}
module.exports = userLoginSchema;