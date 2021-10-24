var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var communityRouter = require("./routes/community");
const jwt = require("jsonwebtoken");
/**Models */
const Message = require("./models/Message");
const {countries} = require("./helper/countries")
var app = express();

/**Sockets */
var server = http.createServer(app);
var io = require('socket.io').listen(server);


/**MongoDB bağlantısı */
const mongoose = require("mongoose");
require('dotenv').config()
mongoose.connect(process.env.DB_HOST,{useNewUrlParsertrue:true},() => {
  //console.log("bağlandı");
})

const communityRooms = ["turkey","england","germany","france","italy"]

const findCountryId =(key) => {
  for(i =0; i< countries.length;i++) {
    if(countries[i].key == key)
      return countries[i].id;
  }
}

io.on("connection",(socket) => {
  console.log("bağlandı");
})


io.of("/community").on("connection",(socket) => {
  let room;
  socket.on("joinRoom",(num) => {
    for (var i in communityRooms) {
        socket.leave(communityRooms[i])
    }    
    if(communityRooms.includes(num)) {
      room = `${num}`;
      socket.join(num); 
      console.log(room);
      Message.find({country:findCountryId(room)}).limit(250).sort({"sendDate":-1}).populate("sender","username image profileDescription location sendDate").exec(function(err,result){
        io.of("/community").to(room).emit("lastMessages",result.reverse());  
      })       
    }
  });

  socket.on("sendMessage",async function(data) {
    console.log(data);
    try{
      let verified = jwt.verify(data.token,process.env.TOKEN_SECRET);
      let user = verified;
      const message = new Message({
        sender : user._id,
        message : data.message,
        country:findCountryId(((room == "" || room == null) ? 2:room))
      });
      try{
        const saveMessage =  await  (await message.save());
        if(saveMessage) {
          console.log(saveMessage);
            console.log("eklendi");
            Message.findOne({_id:saveMessage._id}).populate("sender","username image profileDescription location").exec(function(err,result){
              console.log(result);
              io.of("/community").to(room).emit("newMessage",result);
          })            
        }else {
            console.log("pattt");
        }

      }catch(e) {
          console.log(e);
      }
    }catch(e) {
      console.log(e);
    }
   
   
  });

});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/community',communityRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




// var port_number = server.listen(process.env.PORT || 3000, function(){
//   console.log("listening :"+process.env.PORT || 3000);
// });

// app.listen(port_number);


server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening to requests on http://localhost:2555`);
});
module.exports = app;
