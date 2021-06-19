using System;
using System.Collections.Generic;

namespace animalAid_server.Models
{
    public class Rating
    {
        public int Id {get; set;}
        public string Comment {get; set;}
        public int Rate {get; set;}
        public int VetId {get; set;}

        public Vet Vet {get; set;}

    }
}