using System;
using System.Collections.Generic;

namespace animalAid_server.Models
{
    public class Speciality
    {
        public int Id {get; set;}
        public string SpecialityName {get; set;}
        public ICollection<Vet> Vets {get; set;}

    }
}