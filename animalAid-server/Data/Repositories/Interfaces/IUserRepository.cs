using System;
using animalAid_server.Models;
using System.Threading.Tasks;
using animalAid_server.Models.BindingModels;
using animalAid_server.Data.Repositories;

namespace animalAid_server.Data.Repositories.Interfaces
{
    public interface IUserRepository
    {
        public Task<bool> RegisterUser(RegisterUser user);
        public Task<bool> LoginUser(LoginUser user);
    }
}