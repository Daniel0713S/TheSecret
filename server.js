const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;


const users = require('./users');

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');


const { ObjectId } = require('mongodb');
const connectDB = require('./db');

// Load environment variables
dotenv.config();


app.use(cors({
  origin: 'http://localhost:3000', // Update this to match your frontend origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



// Middleware to validate Firebase token
async function authenticateFirebaseToken(req, res, next) {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) {
    console.error('No Firebase ID token found in Authorization header');
    return res.status(401).json({ error: 'auth-missing', message: 'Firebase ID token required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Decoded Firebase Token:', decodedToken); // Debugging
    req.user = decodedToken; // Store the entire decoded token
    next();
  } catch (err) {
    console.error('Firebase token verification failed:', err);
    res.status(401).json({ error: 'auth-failed', message: 'Invalid Firebase ID token' });
  }
}

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

app.get("/health", (req, res) => {
  res.status(200).send({ message: "Health ok!"  })
})

// Entries management
app.get('/api/v2/entries', authenticateFirebaseToken, async (req, res) => {
  const username = req.user.email;
  const db = await connectDB();
  if (!users.isValidUsername(username)) {
    return res.status(403).json({ error: 'auth-insufficient', message: 'Invalid user' });
  }

  try {
    const entries = await db.collection('entries').find({ username }).toArray();
    //res.json(entries);
    const normalizedEntries = entries.map(entry => ({
      ...entry,
      id: entry._id.toString(),
      _id: undefined, // Remove `_id` field
    }));
    res.json(normalizedEntries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

app.post('/api/v2/entries', authenticateFirebaseToken, async (req, res) => {
  const db = await connectDB();
  const username = req.user.email;
  const { title, content } = req.body;

  console.log('Received entry data:', { username, title, content }); // Debugging

  if (!title || !content) {
    console.error('Invalid entry data:', { title, content }); // Log the error
    return res.status(400).json({ error: 'required-entry', message: 'Title and content are required' });
  }

/*   try {
    const result = await db.collection('entries').insertOne({
      username,
      title,
      content,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    res.json({ id: result.insertedId }); */
    try {
      const newEntry = {
        username,
        title,
        content,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      const result = await db.collection('entries').insertOne(newEntry);
      //newEntry._id = result.insertedId; // Add the `id` to the object
      newEntry.id = result.insertedId.toString();
      res.json(newEntry);
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
});

app.put('/api/v2/entries/:id', authenticateFirebaseToken, async (req, res) => {
  const db = await connectDB();
  const username = req.user.email;
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'required-entry', message: 'Title and content are required' });
  }

  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
  if (!objectId) {
    return res.status(400).json({ error: 'invalid-id', message: 'Invalid entry ID format' });
  }

  try {
    const result = await db.collection('entries').findOneAndUpdate(
      { _id: objectId },
      { $set: { title, content, modifiedAt: new Date() } },
      //{ returnDocument: 'after' } // Return the updated document
    );

    if (!result.value) {
      return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
    }
    const updatedEntry = {
      ...result.value,
      id: result.value._id.toString(),
      _id: undefined,
    };

    res.json(updatedEntry);
    //res.json(result.value); // Return the updated entry
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  }

/*   try {
    const result = await db.collection('entries').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, modifiedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
    }

    res.json({ message: `Entry with ID ${id} updated successfully` });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  } */
});

app.patch('/api/v2/entries/:id', authenticateFirebaseToken, async (req, res) => {
  const db = await connectDB();
  const username = req.user.email;
  const { id } = req.params;
  const updates = req.body;
    // Validate and convert id
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
  if (!objectId) {
    return res.status(400).json({ error: 'invalid-id', message: 'Invalid entry ID format' });
  }

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'required-entry', message: 'No updates provided' });
  }

  try {
    const result = await db.collection('entries').findOneAndUpdate(
      { _id: objectId },
      { $set: { ...updates, modifiedAt: new Date() } },
      //{ returnDocument: 'after' } // Return the updated document
    );

    if (!result.value) {
      return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
    }
    const updatedEntry = {
      ...result.value,
      id: result.value._id.toString(),
      _id: undefined, // Remove `_id` field
    };

    res.json(updatedEntry); 
    //res.json(result.value); // Return the updated entry
  } catch (error) {
    console.error('Error patching entry:', error);
    res.status(500).json({ error: 'Failed to patch entry' });
  }


/*   try {
    const result = await db.collection('entries').updateOne(
      { _id: objectId },
      { $set: { ...updates, modifiedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
    }

    res.json({ message: `Entry with ID ${id} patched successfully` });
  } catch (error) {
    console.error('Error patching entry:', error);
    res.status(500).json({ error: 'Failed to patch entry' });
  } */
});

app.delete('/api/v2/entries/:id', authenticateFirebaseToken, async (req, res) => {
  const db = await connectDB();
  const username = req.user.email;
  const { id } = req.params;

    // Validate and convert id
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
  if (!objectId) {
    return res.status(400).json({ error: 'invalid-id', message: 'Invalid entry ID format' });
  }

  try {
    const result = await db.collection('entries').deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
    }

    res.json({ message: `Entry with ID ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

/* // Entries management
app.get('/api/v2/entries', authenticateFirebaseToken, (req, res) => {
  const username = req.user.email;

  if (!users.isValidUsername(username)) {
    return res.status(403).json({ error: 'auth-insufficient', message: 'Invalid user' });
  }

  const userEntries = users.getUserData(username);
  res.json(userEntries.getEntries());
});

app.post('/api/v2/entries', authenticateFirebaseToken, (req, res) => {
  const username = req.user.email;
  const { title, content } = req.body;

  console.log('Received entry data:', { username, title, content }); // Debugging

  if (!title || !content) {
    console.error('Invalid entry data:', { title, content }); // Log the error
    return res.status(400).json({ error: 'required-entry', message: 'Title and content are required' });
  }

  const userEntries = users.getUserData(username);
  const id = userEntries.addEntry(title, content);
  res.json(userEntries.getEntry(id));
});

app.put('/api/v2/entries/:id', authenticateFirebaseToken, (req, res) => {
  const username = req.user.email;
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'required-entry', message: 'Title and content are required' });
  }

  const userEntries = users.getUserData(username);
  if (!userEntries.contains(id)) {
    return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
  }

  userEntries.updateEntry(id, { title, content });
  res.json(userEntries.getEntry(id));
});

app.patch('/api/v2/entries/:id', authenticateFirebaseToken, (req, res) => {
  const username = req.user.email;
  const { id } = req.params;
  const entryUpdates = req.body;

  if (!entryUpdates || Object.keys(entryUpdates).length === 0) {
    return res.status(400).json({ error: 'required-entry', message: 'No updates provided' });
  }

  const userEntries = users.getUserData(username);
  if (!userEntries.contains(id)) {
    return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
  }

  userEntries.updateEntry(id, entryUpdates);
  res.json(userEntries.getEntry(id));
});

app.delete('/api/v2/entries/:id', authenticateFirebaseToken, (req, res) => {
  const username = req.user.email;
  const { id } = req.params;

  const userEntries = users.getUserData(username);
  if (!userEntries.contains(id)) {
    return res.status(404).json({ error: 'entry-not-found', message: `No entry found with ID ${id}` });
  }

  userEntries.deleteEntry(id);
  res.json({ message: `Entry with ID ${id} deleted successfully` });
}); */







const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/v2/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: "Missing or invalid text for summarization." });
  }

  try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
              { role: "system", content: "You are a helpful assistant that summarizes text." },
              { role: "user", content: `Summarize the following text in a concise way:\n\n${text}` },
          ],
          max_tokens: 5,
          temperature: 0.1,
      });

      const summary = response.data.choices[0]?.message?.content?.trim();
      if (!summary) {
          throw new Error("No summary returned by OpenAI.");
      }

      res.json({ summary });
  } catch (err) {
 if (err.response?.status === 429) {
            // Forward the 429 status to the frontend
            console.error("OpenAI API error:", err.response.data);
            return res.status(429).json({
                error: "quota-exceeded",
                message: "You have exceeded your OpenAI quota. Please check your plan and billing details.",
            });
        }

        // Handle other errors as 500
        console.error("OpenAI API error:", err.message);
        res.status(500).json({ error: "Failed to generate summary. Please try again later." });
    }
});






app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
