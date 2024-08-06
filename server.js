const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const express = require('express');
require('dotenv').config();

const app = express();
const PORT =4500;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('L\'application est connectée à la base de données MongoDB');

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, default: 0 },
    favoriteFoods: { type: [String], default: [] }
  });
  const Person = mongoose.model('Person', personSchema);
  console.log('Create a person with this prototype');
  console.log(Person);

const createPerson = async () => {
    try {
      const person = new Person({ name: 'wassim', age: 30, favoriteFoods: ['music', 'development', 'pizza'] });
      const savedPerson = await person.save();
      console.log(`La personne ${savedPerson.name} a été créée dans la base de données`);
      return savedPerson;
    } catch (err) {
      console.error('Erreur lors de la création de la personne :', err);
    }
  }
const arrayOfPersons = [
    { name: 'rim', age: 50, favoriteFoods: ["spagetti", "sandwich"] },
    { name: 'iheb', age: 25, favoriteFoods: ["pizza", "spaghetti"] },
    { name: 'nour', age: 35, favoriteFoods: ["pizza", "mlwai"] },
  ];
  
  const createManyPersons = async () => {
    try {
      const data = await Person.create(arrayOfPersons);
      console.log(' personnes créées dans la base de données avec succès:');
      return data;
    } catch (err) {
      console.error('Erreur lors de la création de plusieurs personnes :', err);
    }
  }

const findOnePerson = async (personName) => {
    try {
      const data = await Person.find({ name: personName });
      console.log('Les personnes trouvées de nom', personName, 'sont:',data.name);
      return data;
    } catch (err) {
      console.error('Erreur lors de la recherche par nom :', err);
    }
  }
const findOneFood = async (food) => {
    try {
      const data = await Person.findOne({ favoriteFoods: food });
      const persons = await Person.find({ favoriteFoods: food });
      console.log('La première personne dans la base avec la nourriture', food, 'est :', data.name, );
      return  persons ,data;
    } catch (err) {
      console.error('Erreur lors de la recherche par nourriture :', err);
    }
  }
  
  const findById = async (personId) => {
    try {
      const data = await Person.findById(new ObjectId(personId));
      console.log('La personne :', data.name, 'avec ID :', personId);
      return data;
    } catch (err) {
      console.error('Erreur lors de la recherche par ID :', err);
    }
  }
  
  const updateFavoriteFood = async (personId) => {
    try {
      const data = await Person.findById(new ObjectId(personId));
      data.favoriteFoods.push('hamburger');
      const updatedPerson = await data.save();
      console.log('Mis à jour avec succès. Nouveaux favoris :', updatedPerson.favoriteFoods);
      return updatedPerson;
    } catch (err) {
      console.error('Erreur lors de la mise à jour des favoris :', err);
    }
  };
  
  
  const updatePersonAge = async (personName) => {
    try {
      const person = await Person.findOne({ name: personName });
      console.log('Ancien âge de', person.name, ':', person.age);
      const updatedPerson = await Person.findOneAndUpdate(
        { name: personName },
        { age: 20 },
        { new: true }
      );
      console.log(`Âge de ${person.name} mis à jour à :`, updatedPerson.age);
      return updatedPerson;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'âge :', err);
    }
  };
  

  const deletePersonById = async (personId) => {
    try {
      const data = await Person.findByIdAndDelete(new ObjectId(personId));
      console.log('Personne supprimée :', data.name);
      return data;
    } catch (err) {
      console.error('Erreur lors de la suppression de la personne :', err);
    }
  };
  const deleteManyPersons = async (personName) => {
    try {
      const result = await Person.deleteMany({ name: personName });
      console.log('Personnes supprimées :', result.deletedCount);
      return result;
    } catch (err) {
      console.error('Erreur lors de la suppression de plusieurs personnes :', err);
    }
  };
  const findPizza = async (food) => {
    try {
      const data = await Person.find({ favoriteFoods: food }).limit(4).select({ name: 1, _id: 0 }).exec();
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Chain Search Query Helpers to Narrow Search Results------------\n\n');
      console.log(data);
    } catch (err) {
      console.error('Erreur lors de la recherche par nourriture :', err);
    }
  }
  
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données MongoDB :', err);
  });
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port http://localhost:${PORT}`);
});