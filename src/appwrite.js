import { Client, Query, Databases, ID } from "appwrite";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint(`https://cloud.appwrite.io/v1`)
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchValue = async (searchValue, movie) => {
    // Use Appwrite SDK to check if the movie already exists in the database
    // If it does, update the movie's count
    // If theres no document, create a new one with the searchValue and count of 1
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchValue', searchValue),
        ]);
        if(result.documents.length > 0) {
            const document = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {
                searchValue,
                count:document.count + 1,
            });
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchValue,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    })
 }} catch (error) {
        console.log(error);
    }
};

export const getTrendingMovies = async () => {
    try {
     const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
       Query.limit(5),
       Query.orderDesc("count")
     ])
   
     return result.documents;
    } catch (error) {
     console.error(error);
    }
   }
