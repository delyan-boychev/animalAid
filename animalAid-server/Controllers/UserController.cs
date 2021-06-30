using Microsoft.AspNetCore.Mvc;
using System;
using animalAid_server.Models;
using System.Text;
using System.Threading.Tasks;
using animalAid_server.Data;
using animalAid_server.Models.BindingModels;
using animalAid_server.Data.Repositories;
using animalAid_server.Data.Repositories.Interfaces;

namespace animalAid_server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController:ControllerBase
    {
        private IUserRepository userRepository;

        public UserController()
        {
            userRepository = new UserRepository();
        }
        [HttpPost("RegisterUser")]
        public async Task<ResultRequest> RegisterUser([FromForm]RegisterUser user)
        {
            string message = "";
            if(await userRepository.RegisterUser(user))
            {
                message = Status.RegisterSuccess();
            }
            else
            {
                message = Status.AlreadyExists("Потребителят");
            }
            return new ResultRequest(200){Message = message};
        }
        [HttpPost("RegisterVet")]
        public async Task<ResultRequest> RegisterVet([FromForm]RegisterUser user)
        {
            string message = "";
            if(await userRepository.RegisterVet(user))
            {
                message = Status.RegisterSuccess();
            }
            else
            {
                message = Status.AlreadyExists("Ветеринарят");
            }
            return new ResultRequest(200){Message = message};
        }
        [HttpPost("LoginUser")]
        public async Task<ResultRequest> LoginUser([FromForm]LoginUser user)
        {
            string message = "";
            if(await userRepository.LoginUser(user))
            {
                message = Status.LoginSuccess();
                HttpContext.Session.Set("email", Encoding.UTF8.GetBytes(user.Email));
            }
            else
            {
                message = Status.InvalidEmailOrPass();
            }
            return new ResultRequest(200){Message = message};
        }
        [HttpPost("LogOut")]
        public ResultRequest LogOut([FromForm]string email)
        {
            HttpContext.Session.Remove("email");
            return new ResultRequest(200);
            
        }
    }
}