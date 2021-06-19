using System;
using animalAid_server.Models;
using System.Collections.Generic;

namespace animalAid_server.Models
{
    public class Vet:User
    {
        public ICollection<Speciality> Specialities {get; set;}
        public string Address {get; set;}
        public string RegNumber {get; set;}
        public ICollection<Rating> Ratings {get; set;}   
    }
}