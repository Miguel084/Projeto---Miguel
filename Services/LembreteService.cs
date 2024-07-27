using LembreteApp.Models;
using MongoDB.Driver;
using System.Collections.Generic;

namespace LembreteApp.Services
{
    public class LembreteService
    {
        private readonly IMongoCollection<Lembrete> _lembretes;

        public LembreteService(IMongoClient client)
        {
            var database = client.GetDatabase("LembreteDb");
            _lembretes = database.GetCollection<Lembrete>("Lembretes");
        }

        public List<Lembrete> Get() =>
            _lembretes.Find(lembrete => true).SortBy(lembrete => lembrete.Data)
                      .ToList();

        public Lembrete Get(string id) =>
            _lembretes.Find<Lembrete>(lembrete => lembrete.Id == id).FirstOrDefault();

        public Lembrete Create(Lembrete lembrete)
        {
            _lembretes.InsertOne(lembrete);
            return lembrete;
        }

        public void Update(string id, Lembrete lembreteIn) =>
            _lembretes.ReplaceOne(lembrete => lembrete.Id == id, lembreteIn);

        public void Remove(Lembrete lembreteIn) =>
            _lembretes.DeleteOne(lembrete => lembrete.Id == lembreteIn.Id);

        public void Remove(string id) =>
            _lembretes.DeleteOne(lembrete => lembrete.Id == id);
    }
}
