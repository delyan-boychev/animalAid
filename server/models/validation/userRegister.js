const userRegisterSchema =
{
    "id": "/userRegister",
    "type": "object",
    "properties": {
        "name": {
            "first": {"type": "string", "minLength": 2},
            "last": {"type": "string", "minLength": 2},
            "required": ["first", "last"]
        },
        "role": {"type": "string", "enum": ["User", "Vet"]},
        "city": {"type": "string", "minLength": 2},
        "password": {"type": "string", "minLength": 8, "maxLength": 98},
        "email": {"type":"string", "format":"email"},
        "phoneNumber": {"type": "string", "pattern": "^\\+(?:[0-9]●?){6,14}[0-9]$"},
    },
    "required": ["role", "name", "city", "password", "email", "phoneNumber"]
}
module.exports = userRegisterSchema;