async function sessionAuth(req,res,next) {
  res.locals.user = req.session.user
  res.locals.isAdmin = false
  console.log("session user",req.session.user)
  if(req.session.user)
  {
    res.locals.isAdmin= Boolean(
      req.session.user.role.find((r) => r == 'Admin')
    )
    console.log(res.locals.isAdmin)
  }
  else req.session.user = null

  req.flash = function(type,message){
    req.session.flash = {type, message}
  }

  if(req.session.flash)
  {
    res.locals.flash = req.session.flash;
    req.session.flash = null;
  }
  next();
  
}

module.exports = sessionAuth