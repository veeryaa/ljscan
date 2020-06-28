const functions = require('firebase-functions');
const vision = require('@google-cloud/vision');
const cors = require('cors')();

exports.scanLembar = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const client = new vision.ImageAnnotatorClient();
    const requests = {
      image: {
        source: {
          imageUri: req.body.image
        }
      },
      imageContext: {
        languageHints: ['id']
      }
    }

    client.textDetection(requests).then((results) => {
      let textDetection = results[0].textAnnotations;
      let keywordDelimiter = 'matpel';

      let extracted = textDetection[0].description.toLowerCase().split('\n');
      let delimatches = extracted.filter(element => element.includes(keywordDelimiter)).toString();
      let matpelIndex = extracted.indexOf(delimatches);
      let whitespaceIndex = extracted.indexOf('');
      let answers = [];
      let responseObject = {
        key: {},
        status: 'success'
      }

      for (let i = matpelIndex + 1; i < extracted.length; i++) {
        if (i === whitespaceIndex) {
          break;
        } else {
          answers.push(extracted[i].split(' ').join(''));
        }
      }

      for (let i = 0; i < answers.length; i++) {
        let questionKey = answers[i].split('.');
        switch(questionKey[0]) {
          case 'b':
            questionKey[0] = '8';
            break;
          case 's':
            questionKey[0] = '5';
            break;
          case 'o':
            questionKey[0] = '0';
            break;
        }

        switch (questionKey[1]) {
          case 'p':
            questionKey[1] = 'd';
            break;
          case 'l':
            questionKey[1] = 'c';
            break;
          case '3':
            questionKey[1] = 'b';
            break;
          case '8':
            questionKey[1] = 'b';
            break;
        }
        responseObject.key[questionKey[0]] = questionKey[1];
      }
      res.status(200).json(responseObject);
    });
  });
});