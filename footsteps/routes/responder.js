var express = require('express');
const fs = require('fs');
const axios = require('axios');
var names = [];
var router = express.Router();
var names = [];

fs.readFile('footsteps/names.json', 'utf8', (err, data) => {
      if (err) console.log(err.message);
      names = JSON.parse(data);
  });

router.post('/ask', async (req, res) => {
      var data = req.body.data;
      //data = data.substring(1, data.length - 1); // Remove quotes

      var result = await ask(data).catch((error) => {
            res.statusCode = 500;
            res.end(error);
      });
      
      res.end(result);
});

router.post('/random', (req, res) => {
      randomName = random();
      res.data = randomName;
      res.end(randomName);
});

function random() {
      var random = Math.floor(Math.random() * names.length);
      console.log("Random: " + names[random]);
      return names[random];
}

async function ask(data) {
      var name = data;
      if (names.includes(name)) {
            return fs.readFileSync("footsteps/data/" + name + ".json", 'utf8');
      }
      var result = await askAI(name.replace("-", " "));
      saveData(name, result);
      
      return result;
}

async function saveData(name, data) {
      fs.writeFile("data/" + name + ".json", data, (err) => {
            if (err) console.log(err);
            console.log('Saved to ' + name + ".json");
      });
      names.push(name);
      fs.writeFile('names.json', JSON.stringify(names), (err) => {
            if (err) console.log(err);
      });
}

var result;
async function askAI(name) {
      console.log("Asked for " + name);
      question = `List the places ${name} have been to throughout his/her life, \
              including his/her place of birth and death (if the person is deceased),\
              list as many as possible.
              List these places in chronological order and specify the years he/she stayed in there.\
              Write a brief of his/her life and career in each of these places.\
              Then, find the longitude and latitude of these places.\
              Format all the data into the following json format.\
              [{"city": , "country": , "longitude": , "latitude": , \
              "start_year": , "end_year": , "description": , "is_deceased":}]\
              Do not give other comments besides the json.\
              `;
      query = JSON.stringify({
            "model": "llama-2-13b-chat",
            "messages": [
                  {
                        "role": "user",
                        "content": question
                  }
            ],
            "stream": false,
            "model_params": {
                  "temperature": 0.5
            }
      });

      let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.theb.ai/v1/search/completions',
            headers: {
                  'Authorization': 'Bearer sk-VceFfcsKyaoI35ZxiO61VGhlQi5BSQ3NTQ5OXhMoJuwNc2uY',
                  'Content-Type': 'application/json'
            },
            data: query
      };
      response = await axios.request(config)
            .catch((error) => {
                  console.log(error.message);
                  throw error.message;
            });
      if (false && response.statusCode != 200) {
            console.log(response.data);
            throw "Failed to ask AI";
      }
      result = response.data.choices[0].message.content;
      result = result.replaceAll(/\\n/g, '\n');
      result = result.replaceAll(/\\/g, '');
      result = result.replaceAll("N/A", "-1");
      result = result.replaceAll("-,", "-1,");
      result = result.replace("```json", '');
      result = result.replace("```", '');
      return result;
}

module.exports = router;
