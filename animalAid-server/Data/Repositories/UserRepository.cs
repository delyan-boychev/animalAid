using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using BCrypt.Net;
using animalAid_server.Data.Repositories.Interfaces;
using animalAid_server.Models;
using animalAid_server.Models.BindingModels;
using System.Collections.Generic;
namespace animalAid_server.Data.Repositories
{
    public class UserRepository:IUserRepository
    {
        private AnimalAidDbContext db;
        public UserRepository()
        {
            db = new AnimalAidDbContext();
        }
        public async Task<bool> RegisterUser(RegisterUser user)
        {
            if(await db.Users.AnyAsync(u=> u.Email == user.Email))
            {
                return false;
            }
            else
            {
                User u = new User();
                u.FirstName = user.FirstName;
                u.LastName = user.LastName;
                u.Email = user.Email;
                u.City = user.City;
                u.PhoneNumber = user.PhoneNumber;
                u.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, 10);
                u.CreatedOn = new DateTime();
                u.Confirmed = false;
                await db.Users.AddAsync(u);
                await db.SaveChangesAsync();
                return true;
            }

        }
        public async Task<bool> LoginUser(LoginUser user)
        {
            User u = await db.Users.FirstAsync(u=>u.Email == user.Email);
            if(u!=null)
            {
                if(BCrypt.Net.BCrypt.Verify(user.Password, u.Password))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }
}