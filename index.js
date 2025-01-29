
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 5000


// set middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://tutortrack-48.web.app',
        'https://tutortrack-48.firebaseapp.com'

    ],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// custom middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    // console.log('got the token for verify', token)
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    // verify this token with verify method
    jwt.verify(token, process.env.API_SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.user = decoded; // double make sure that user email and req email are same
        next()
    })

}

// connected to mongoDB

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER_TUTOR}:${process.env.DB_PASS_TUTOR}@cluster0.ho6hi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // create database collection
        const db = client.db('tutorTrack')
        // all tutor collection
        const tutorCollection = db.collection('tutorCollection')
        // all register user collection
        const registerUserCollection = db.collection('registerUserCollection')
        // booked tutors collection
        const bookedTutorsCollection = db.collection('bookedTutorsCollection');

  

        // auth api
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.API_SECRET_TOKEN, {
                expiresIn: '1h'
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            })
                .send({ success: true })
        })

        // when user logout cookies token remove

        app.post('/logout', (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            }).send({ success: true });
        });




        // search functionality
        // not use here but when database size increase. This way to implement 
        // search functionality improve search quality
        // app.get('/search', async (req, res) => {
        //     const { language } = req.query; // Get the search term from the query parameter
        //     if (!language) {
        //         return res.status(400).json({ error: 'Search query is required' });
        //     }

        //     try {
        //         const results = await collection.find({
        //             language: { $regex: language, $options: 'i' }, // Case-insensitive regex search
        //         }).toArray();

        //         res.json(results); // Return the search results to the client
        //     } catch (error) {
        //         console.error('Error performing search:', error);
        //         res.status(500).json({ error: 'Failed to perform search' });
        //     }
        // });

        // get all teachers data
        app.get('/allTutors', async (req, res) => {

            try {
                const cursor = tutorCollection.find();
                const tutors = await cursor.toArray()

                res.send(tutors)
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch allTutors' });
            }

        })

        // booked tutor collections
        app.get('/booked-tutors', verifyToken, async (req, res) => {
            try {
                const cursor = bookedTutorsCollection.find();
                const bookedTutor = await cursor.toArray();

                res.send(bookedTutor)
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch booked tutors' });
            }
        })

        // get booked tutors data using current user
        app.get('/booked-tutors/:email', verifyToken, async (req, res) => {
            const email = req.params.email;

            // when login email and query email are not same
            if (req.user?.email !== email) {
                return res.status(401).send({ message: 'unauthorized access' })
            }

            // Simple email format validation
            if (email.includes('@')) {
                try {
                    const myBookedTutors = await bookedTutorsCollection.find({ email: email }).toArray();

                    // Check if data is found
                    if (myBookedTutors.length > 0) {
                        return res.send(myBookedTutors);
                    } else {
                        return res.status(404).send({ message: "No Tutors found for this email" });
                    }
                } catch (error) {
                    console.error(error);
                    return res.status(500).send({ error: "Failed to fetch Tutors" });
                }
            } else {
                return res.status(400).send({ error: "Invalid email format" });
            }
        });

        // get Tutors data with their specific id

        app.get('/allTutors/:id', async (req, res) => {
            const id = req.params.id;

            // Validate ObjectId format
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ error: "Invalid tutor ID format" });
            }

            try {
                const query = { _id: new ObjectId(id) };
                const tutor = await tutorCollection.findOne(query);

                if (tutor) {
                    res.send(tutor);
                } else {
                    res.status(404).send({ message: "Tutor not found" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Failed to fetch tutor by id" });
            }
        });

        // get data using language

        app.get('/allTutors/lang/:lang', async (req, res) => {
            const language = req.params.lang;

            try {
                // Fetch all tutors that speak the given language
                const tutors = await tutorCollection.find({ language: language }).toArray();

                if (tutors.length > 0) {
                    res.send(tutors);  // Return the list of tutors
                } else {
                    res.status(404).send({ message: "No tutors found for the given language" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Failed to fetch tutors by language" });
            }
        });

        // get data using email for how many tutorials add into tutorials collection

        app.get('/my-tutorials/:email', verifyToken, async (req, res) => {

            const email = req.params.email;

            // when login email and query email are not same
            if (req.user.email !== email) {
                return res.status(401).send({ message: 'unauthorized access' })
            }


            if (email.includes('@')) {
                try {

                    const myTutorials = await tutorCollection.find({
                        email: email
                    }).toArray()

                    if (myTutorials.length > 0) {
                        return res.send(myTutorials)
                    } else {
                        return res.status(404).send({ message: "No tutorials found for this email" });
                    }
                } catch (error) {
                    return res.status(500).send({ error: "Failed to fetch tutorials" });
                }
            }
        })

        app.get('/my-added-tutorial/:id', verifyToken, async (req, res) => {
            const id = req.params.id;

            // Validate ObjectId format
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ error: "Invalid tutor ID format" });
            }

            try {
                const query = { _id: new ObjectId(id) };
                const tutor = await tutorCollection.findOne(query);

                if (tutor) {
                    res.send(tutor);
                } else {
                    res.status(404).send({ message: "Tutor not found" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Failed to fetch tutor by id" });
            }
        });

        // get register user collection data
        app.get('/register-user/:email', async (req, res) => {
            const email = req.params.email;

            if (email.includes('@')) {
                try {
                    const registerUser = await registerUserCollection.findOne({ email: email });

                    if (registerUser) {
                        return res.send(registerUser);
                    } else {
                        return res.status(404).send({ message: "No user found for this email" });
                    }
                } catch (error) {
                    return res.status(500).send({ error: "Failed to fetch user" });
                }
            } else {
                return res.status(400).send({ error: "Invalid email format" });
            }
        });


        app.get('/register-user', verifyToken, async (req, res) => {

            const email = req.params.email;

            // when login email and query email are not same
            if (req.user.email !== email) {
                return res.status(401).send({ message: 'unauthorized access' })
            }

            try {
                const cursor = registerUserCollection.find();
                const user = await cursor.toArray()

                res.send(user)
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch users' });
            }

        })

        // insert data into register user collection from client side
        app.post('/registerUsers', async (req, res) => {
            const registerUer = req.body;

            try {
                const result = await registerUserCollection.insertOne(registerUer)
                res.send(result)
            } catch (error) {
                res.status(500).send({ error: 'Failed to add user' });
            }
        })

        // new tutors added into tutorCollection
        app.post('/allTutors', verifyToken, async (req, res) => {

            const loggedInEmail = req.user?.email;
            const queryEmail = req.body?.email;

            // Verify that the logged-in user's email matches the email in the query
            if (loggedInEmail !== queryEmail) {
                return res.status(403).send({ message: 'Forbidden: Email mismatch' });
            }

            const tutor = req.body;
            try {
                const result = await tutorCollection.insertOne(tutor)
                res.send(result)
            } catch (error) {
                res.status(500).send({ error: 'Failed to add user' });
            }

        })

        // booked tutors data store
        app.post('/booked-tutors', async (req, res) => {
            const bookedTutor = req.body;
            try {
                const result = await bookedTutorsCollection.insertOne(bookedTutor)
                res.send(result)

            } catch (error) {
                res.status(500).send({ error: 'Failed to add booked Tutor' });
            }

        })

        // update tutorials data
        app.put('/update-tutorials/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updateTutorial = req.body;

            const tutorial = {
                $set: {
                    image: updateTutorial.image,
                    language: updateTutorial.language,
                    price: updateTutorial.price,
                    description: updateTutorial.description
                }
            }

            try {
                const result = await tutorCollection.updateOne(filter, tutorial, option);
                if (result.modifiedCount > 0) {
                    res.send(result)
                } else {
                    res.status(500).send({ error: 'Failed to update tutorials' });
                }
            } catch {
                res.status(500).send({ error: 'Failed to update tutorials' });
            }
        })

        // update review
        app.patch('/booked-tutors/:id', async (req, res) => {
            const id = req.params.id;

            // Ensure id is valid
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ObjectId' });
            }

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateReview = req.body;

            // Check if `review` is provided in the request body
            if (!updateReview.review) {
                return res.status(400).json({ error: 'Review value is missing in request body' });
            }

            const updateDoc = {
                $set: {
                    review: updateReview.review,
                },
            };

            try {
                const result = await bookedTutorsCollection.updateOne(filter, updateDoc, options);

                if (result.modifiedCount > 0) {
                    // Fetch and return the updated document
                    const updatedTutor = await bookedTutorsCollection.findOne(filter);
                    res.status(200).json(updatedTutor);
                } else {
                    res.status(404).json({ error: 'Failed to update tutorial or no changes detected' });
                }
            } catch (error) {
                console.error('Error updating tutorial:', error);
                res.status(500).json({ error: 'Failed to update tutorial' });
            }
        });


        // increase review for the tutor
        app.patch('/increase-reviews/:id', async (req, res) => {
            try {
                const id = req.params.id;

                // Ensure id is valid
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: 'Invalid ObjectId' });
                }

                const result = await tutorCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $inc: { review: 1 } }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: 'Tutor not found or no review count to update' });
                }

                const updatedTutor = await tutorCollection.findOne({ _id: new ObjectId(id) });
                res.json(updatedTutor);  // Send the updated review data
            } catch (error) {
                console.error('Error increasing review count:', error);
                res.status(500).json({ error: 'Failed to increase review count' });
            }
        });



        // delete tutorial from collection
        app.delete('/my-tutorials/:id', verifyToken, async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await tutorCollection.deleteOne(query);
                if (result.deletedCount === 1) {
                    res.send({ success: true, message: 'Document deleted successfully' });
                } else {
                    res.status(404).send({ success: false, message: 'No document found to delete' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ success: false, message: 'An error occurred' });
            }
        });


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// connected to mongoDB




// test server start
app.get('/', (req, res) => {
    res.send("Tutor Find server is running...")
})

app.listen(port, () => {
    console.log("server is running on port no -", port)
})