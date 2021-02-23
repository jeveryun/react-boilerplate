const adminJson = {
  id: 1,
  name: 'Admin',
  authorities: 'admin',
};
const userJson = {
  id: 2,
  name: 'User',
  authorities: 'user',
};

module.exports = (req, res, next) => {
  if (req.method === 'Post' && req.path === '/login') {
    if (req.body.usename === 'admin' && req.body.password === '123') {
      res.status(200).json(adminJson);
    } else if (req.body.usename === 'use' && req.body.password === '123') {
      res.status(200).json(userJson);
    } else {
      res.status(400).json({ error: 'wrong password' });
    }
  } else {
    next();
  }
};
