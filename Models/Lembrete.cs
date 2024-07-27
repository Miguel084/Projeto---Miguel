using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace LembreteApp.Models
{
    public class Lembrete
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string? Nome { get; set; }

        public DateTime Data { get; set; }
    }
}
