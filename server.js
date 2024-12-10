// import { readFileSync } from "node:fs";
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const { Get_all_users } = require('./modules/auth/user_model')

const app = express();
const port = 9192;
// const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_KEY = "aca840e54f2b8c714bf4eac7fafddf1a984a36d8fa83c1f400b91591d54aac67";

// Serve static files
app.use(express.static('./'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

// login
app.post('/login', async(req, res) => {
  const { username, password } = req.body

  let all_users = await Get_all_users()
  let cur_user = all_users.find(e => e.username == username && e.password == password)
  const token = jwt.sign({ id: cur_user.id, username: cur_user.username }, SECRET_KEY, { expiresIn: '1h' });
  return res.json({token})

  // const query = 'SELECT * FROM users WHERE username = ? AND password = ?'
  // connection.execute(query, [username, password], (err, results) => {
  //   if(err) {
  //     console.error(err)
  //     return res.status(500).json({message: 'DB query err: ' + err})
  //   }

  //   if(results.length > 0) {
  //     const user = results[0]
  //     const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  //     return res.json({token})
  //   }
  // })
  
  // let user = users.find(e => e.username == username && e.password == password)
  // console.log(username, password, user)
  // if (user) {
  //   const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  //   console.log(token)
  //   return res.json({ token });
  // }
  return res.status(401).json({ message: 'Invalid credentials' })
})

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// update data.json
app.post('/updateData', (req, res) => {
  fs.writeFile('./data.json', JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writting file')
    }
    res.status(200).send('Data updated')
  })
})

// get current backlog
app.post('/getCurrentBacklog', (req, res) => {
  const bk = fs.readFileSync('./backlog.json', 'utf8');
  res.json(bk)
})

// create new backlog task
app.post('/createBacklog', (req, res) => {
  fs.writeFileSync("./backlog.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('Error write to backlog file')
      return res.status(500).send('Error write to backlog file')
    }
    console.log('write to backlog is successful')
    res.status(200).send('Backlog updated')
  })
})

// delete from backlog
app.post('/deleteFromBacklog', (req, res) => {
  fs.writeFile("./backlog.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writting file')
    }
    res.status(200).send('Data updated')
  })
})

app.listen(port, () => {
  console.log(`Server running at http://:${port}`);
});
