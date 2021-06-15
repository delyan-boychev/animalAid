using System;
namespace animalAid_server.Models
{
    public class Role
    {
        public static string Admin => "ADMIN";
        public static string Moderator => "MODERATOR";
        public static string User => "USER";
        public static string Vet => "VET";
    }
}