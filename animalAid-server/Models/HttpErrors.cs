using System;
namespace animalAid_server.Models
{
    public static class HttpErrors
    {
        public static string NotFound() => "404";
        public static string UnAuthorized() => "401";
        public static string AccessDenied() => "403";

        public static string BadRequest() => "400";
    }
}