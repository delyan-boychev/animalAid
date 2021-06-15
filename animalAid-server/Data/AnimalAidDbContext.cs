using Microsoft.EntityFrameworkCore;
using System;
using System.Data.SqlClient;
using animalAid_server.Models;
namespace animalAid_server.Data
{
    public class AnimalAidDbContext:DbContext
    {
        public DbSet<User> Users {get; set;}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder
            {
                DataSource = @"localhost",
                InitialCatalog = "animalAid",
                UserID = "testapp",
                Password = "@12345Ab"
            };
            optionsBuilder.UseSqlServer(builder.ConnectionString);
        }

    }
}