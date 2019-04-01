const express = require('express');
const app = express();
const fs = require('fs');
var dictionary = {'spatter': '튀기다', 'inadequate': '불충분한', 'cloister': '회랑',
                  'contemplation': '사색', 'variable':'변수'};
var wordList = Object.keys(dictionary);
const qs = require('querystring');
const bodyParser = require('body-parser');
var num = 0;
app.use(bodyParser.urlencoded({extended:false}));

app.get(`/`, function(request, response){
  var word = wordList[0];
  var html = ` <form action="/check" method="post">
  <h2>${word}</h2>
  <input type="hidden" name="word" value="${word}">
  <input type="text" name="answer">
  <input type="submit">
  </form>`;
  fs.writeFile(`./data/count`, 0, "utf8", function(err)
  {
    response.send(html);
  });
})

app.get(`/${num}`, function(request, response){
  var word = wordList[num];
  if (num == 4)
  {
    var html = ` <form action="/result" method="post">
    <h2>${word}</h2>
    <input type="hidden" name="word" value="${word}">
    <input type="text" name="answer">
    <input type="submit">
    </form>`;
  } else{
  var html = ` <form action="/check" method="post">
  <h2>${word}</h2>
  <input type="hidden" name="word" value="${word}">
  <input type="text" name="answer">
  <input type="submit">
  </form>`;
  }
  response.send(html);
})

app.post('/check', function(request, response)
{
  var post = request.body;
  var coWord = dictionary[post.word];
  var answer = post.answer;
  num += 1;
  if (coWord === answer)
  {
    fs.readFile(`./data/count`, "utf8", function(err, count)
    {
      fs.writeFile(`./data/count`, parseInt(count) + 1, "utf8", function(err)
      {
        response.redirect(`/${num}`);
      });
    });
  } else{response.redirect(`/${num}`);}
})

app.post('/result', function(request, response)
{
  var post = request.body;
  var coWord = dictionary[post.word];
  var answer = post.answer;
  fs.readFile(`./data/count`, "utf8", function(err, count)
  {
    var total;
    if (coWord === answer){total = parseInt(count)+1;}
    else{total = parseInt(count);}
    response.send(`Total point : ${total}`);
  });
})
app.listen(3000,function(){
})
