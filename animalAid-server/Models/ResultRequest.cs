namespace animalAid_server.Models
{
    public class ResultRequest
    {
        public int Code {get; set;}
        public string Message {get; set;}

        public ResultRequest(int code)
        {
            Code = code;
        }
    }
}