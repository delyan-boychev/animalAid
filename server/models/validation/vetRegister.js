const vetRegisterSchema =
{
    "id": "/vetRegister",
    "type": "object",
    "properties": {
        "name": {
            "first": {"type": "string", "minLength": 2},
            "last": {"type": "string", "minLength": 2},
            "required": ["first", "last"]
        },
        "diplomaFile": {"type": "string", "pattern": `^diploma-[0-9]{13}(.pdf)$`},
        "address": {"type": "string", "minLength": 2},
        "city": {"type": "string", "minLength": 2},
        "password": {"type": "string", "minLength": 8, "maxLength": 98},
        "email": {"type":"string", "format":"email"},
        "phoneNumber": {"type": "string", "pattern": "^\\+(?:[0-9]●?){6,14}[0-9]$"},
    },
    "additionalProperties": false,
    "required": [ "name", "city", "password", "email", "phoneNumber"]
}
module.exports = vetRegisterSchema;