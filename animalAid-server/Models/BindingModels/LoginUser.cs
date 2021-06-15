using System;
using System.ComponentModel.DataAnnotations;

namespace animalAid_server.Models.BindingModels
{
    public class LoginUser
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email {get; set;}
        [Required]
        public string Password {get; set;}

    }
}