using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using DotNetEnv;

namespace LembreteApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Carregar variáveis de ambiente do arquivo .env
            DotNetEnv.Env.Load();

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
