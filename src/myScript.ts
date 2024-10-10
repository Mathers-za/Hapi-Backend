import { db } from "./db-config";
const names = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "George",
  "Hannah",
  "Isaac",
  "Julia",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

const arrayData = [];

for (let i = 1; i <= 40; i++) {
  const obj: any = {};
  obj.name = names[Math.floor(Math.random() * names.length)];
  obj.city = cities[Math.floor(Math.random() * cities.length)];

  arrayData.push(obj);
}

db.collection("dataGrid").insertMany(arrayData);
