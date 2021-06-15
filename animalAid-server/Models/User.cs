using System;

namespace animalAid_server.Models
{
    public class User
    {
        public int Id {get; set;}
        public string FirstName {get; set;}
        public string LastName {get; set;}

        public string PhoneNumber {get; set;}
        public string Email {get; set;}
        public string Password {get; set;}

        public string City {get; set;}

        public DateTime CreatedOn {get; set;}

        public bool Confirmed {get; set;}

        public string Role {get; set;}

    }
}