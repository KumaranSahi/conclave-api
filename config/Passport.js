const passport=require('passport');
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const usersdb=require('../models/User.model')

const opts={
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey :process.env["SECRET"]
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    usersdb.findById(jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false);    //error
        }
        if (user) {
            return done(null, user);    //success
        } else {
            return done(null, false);   //user not found
        }
    });
}));

module.exports=passport;