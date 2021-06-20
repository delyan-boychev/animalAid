using System;
namespace animalAid_server.Models
{
    public static class Status
    {
        public static string NotValid(string name) => $"{name} е невалидно!";

        public static string AlreadyExists(string name) => $"{name} вече съществува!";

        public static string SuccessCreated(string name) => $"{name} създад!";

        public static string RegisterSuccess() => "Регистрирахте се успешно!";
        public static string LoginSuccess() => "Влязохте успешно в профила си!";
        public static string InvalidEmailOrPass() => "Грешнен имейл или парола!";

    }
}