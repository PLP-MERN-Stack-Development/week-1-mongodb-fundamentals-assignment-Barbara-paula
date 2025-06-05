//Find all books in a specific genre
db.books.find({genre: "fantasy"})

//find books published after a certain year
db.books.find({published_year: {$gt: 1900}})

//Find books by a specific author
db.books.find({author: "George Orwell"})

//Update the price of a specific bookUpdate the price of a specific book
db.books.updateOne({title: "1984"}, {$set: {price: 11.10}})

//Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" })

//Write a query to find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 }})

//Use projection to return only the title, author, and price fields in your queries
db.books.find({in_stock: true, published_year: {$gt: 2010}}, {_id: 0, author: 1, price: 1, title: 1})

//Implement sorting to display books by price (both ascending and descending)
db.books.find({in_stock: true, published_year: {$gt: 2010}}, {_id: 0, author: 1, price: 1, title: 1}).sort({price: 1})
db.books.find({in_stock: true, published_year: {$gt: 2010}}, {_id: 0, author: 1, price: 1, title: 1}).sort({price: -1})

//Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find().limit(5).skip(0)
db.books.find().limit(5).skip(5)
db.books.find().limit(5).skip(10)

//Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([{$group: { _id: "$genre", averagePrice: { $avg: "$price" }, count: { $sum: 1 }}},  
{$project: {_id: 0, genre: "$_id", averagePrice: { $round: ["$averagePrice", 2] }, count: 1 }},{$sort: { averagePrice: -1 }}])

//Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([{$group: {_id: "$author", bookCount: { $sum: 1 }}}, {$sort: { bookCount: -1 }}, {$limit: 1}, {$project: {_id: 0, author: "$_id", bookCount: 1}}])

//Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([{$addFields: {decade: {$subtract: ["$published_year", { $mod: ["$published_year", 10] }]}}},
  {$group: {_id: "$decade", count: { $sum: 1 }, books: { $push: "$title" }}},
  {$project: {_id: 0, decade: "$_id", count: 1, sampleBooks: { $slice: ["$books", 3] }}},
  { $sort: { decade: 1 }}])

//Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 });
db.books.getIndexes();

//Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: 1 });
db.books.getIndexes();

//Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.dropIndexes();
db.books.find({ title: "1984" }).explain("executionStats");