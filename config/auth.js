const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for users
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

// Middleware to check if user is admin
const authenticateAdmin = (req, res, next) => {
  console.log('Admin Auth Check:', {
    hasSession: !!req.session,
    isAdmin: req.session?.isAdmin,
    adminEmail: req.session?.adminEmail
  });
  
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    console.log('Admin auth failed, redirecting to login');
    return res.redirect('/login');
  }
};

// Middleware to check if already logged in
const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/user/dashboard');
    } catch (error) {
      // Token invalid, continue to login
    }
  }
  
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  
  next();
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  redirectIfAuthenticated
};
