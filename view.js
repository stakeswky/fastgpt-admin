const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://KBGPT:bxStMUbIhz4s4HcQ@kbgpt.bm60gx5.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}) 
.then(() => console.log('Connected to MongoDB successfully!'))
.catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  balance: Number,
  promotion: {
    rate: Number,
  },
  openaiKey: String,
  createTime: Date,
  __v: Number,
});

const User = mongoose.model('User', userSchema, 'users');

app.get('/users', async (req, res) => {
  try {
    const start = parseInt(req.query._start) || 0;
    const end = parseInt(req.query._end) || 20;
    const order = req.query._order === 'DESC' ? -1 : 1;
    const sort = req.query._sort || 'id';

    const users = await User.find().skip(start).limit(end - start).sort({ [sort]: order });
    const totalCount = await User.countDocuments();

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', totalCount);
    res.json(users);
  } catch (err) {
    console.log(`Error fetching users: ${err}`);
  }
});

// Create user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    });

    const createdUser = await newUser.save();
    res.json(createdUser);
  } catch (err) {
    console.log(`Error creating user: ${err}`);
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.log(`Error updating user: ${err}`);
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.log(`Error deleting user: ${err}`);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
