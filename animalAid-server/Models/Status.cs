using System;
namespace animalAid_server.Models
{
    public static class Status
    {
        public static string NotValid(string name) => $"{name} is not valid!";

        public static string AlreadyExists(string name) => $"{name} already exists!";

        public static string SuccessCreated(string name) => $"{name} created successfully!";

        public static string RegisterSuccess() => "Registration successful!";
        public static string LoginSuccess() => "Login successful!";
        public static string InvalidEmailOrPass() => "Invalid email or password";

    }
}