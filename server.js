const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const app = express(); 
app.use(cors()); 
app.use(express.json());

const mongoURI = 'mongodb://kbgpt:kbgpt@localhost:27017/?authSource=admin&readPreference=primary&ssl=false';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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
});

const User = mongoose.model('User', userSchema, 'users');

// 获取用户列表
app.get('/users', async (req, res) => {
  try {
    const start = parseInt(req.query._start) || 0;
    const end = parseInt(req.query._end) || 20;
    const order = req.query._order === 'DESC' ? -1 : 1;
    const sort = req.query._sort || '_id';

    const users = await User.find()
      .skip(start)
      .limit(end - start)
      .sort({ [sort]: order });

    const totalCount = await User.countDocuments();

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', totalCount);
    res.json(users);
  } catch (err) {
    console.log(`Error fetching users: ${err}`);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// 创建用户
app.post('/users', async (req, res) => {
    try {
    const { username, password, balance, promotion, openaiKey = '', avatar = '/icon/human.png' } = req.body;
    if (!username || !password || !balance) {
    return res.status(400).json({ error: 'Invalid user information' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
    }
    const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username,
    password,
    balance,
    promotion: {
    rate: promotion?.rate || 0,
    },
    openaiKey,
    avatar,
    createTime: new Date(),
    });
    const result = await user.save();
    res.json(result);
    } catch (err) {
    console.log(`Error creating user: ${err}`);
    res.status(500).json({ error: 'Error creating user' });
    }
   });
   
   
   
   

// 修改用户信息
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const result = await User.updateOne({ _id: id }, { $set: req.body });

    res.json(result);
  } catch (err) {
    console.log(`Error updating user: ${err}`);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// 删除用户
app.delete('/users/:id', async (req, res) => {
    try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
    }
    const result = await User.deleteOne({ _id: id });
    res.json(result);
    } catch (err) {
    console.log(`Error deleting user: ${err}`);
    res.status(500).json({ error: 'Error deleting user' });
    }
   });
   
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

