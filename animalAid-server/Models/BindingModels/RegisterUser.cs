using System;
using System.ComponentModel.DataAnnotations;

namespace animalAid_server.Models.BindingModels
{
    public class RegisterUser
    {
        [Required]
        public string FirstName {get; set;}
        [Required]
        public string LastName {get; set;}
        [Required]
        public string PhoneNumber {get; set;}
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email {get; set;}
        [Required]
        public string Password {get; set;}
        [Required]
        public string City {get; set;}

    }
}