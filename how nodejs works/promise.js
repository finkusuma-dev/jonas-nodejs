const fs = require('fs');
const superagent = require('superagent');

/// using callback
console.log('reading file...');
// fs.readFile(`${__dirname}/dog_breed.txt`, (err, dogBreed) => {
//   if (err) console.log(err);
//   console.log(`dog breed: ${dogBreed}`);

//   //https://dog.ceo/api/breed/hound/images/random
//   superagent.get(
//     `https://dog.ceo/api/breed/${dogBreed}/images/random`,
//     (err, res) => {
//       if (err) console.log(err);
//       console.log(res.body);
//     }
//   );
// });

function readFileAsync(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

/// using promises

// readFileAsync(`${__dirname}/dog_breed.txt`)
//   .then((dogBreed) => {
//     console.log(`dog breed ${dogBreed}`);
//     return superagent.get(
//       `https://dog.ceo/api/breed/${dogBreed}/images/random`
//     );
//   })
//   .then((res) => {
//     console.log('dog image', res.body.message);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// /// using async await
// (async () => {
//   try {
//     const dogBreed = await readFileAsync(`${__dirname}/dog_breed.txt`);
//     console.log(`dog breed: ${dogBreed}`);
//     const res = await superagent.get(
//       `https://dog.ceo/api/breed/${dogBreed}/images/random`
//     );
//     console.log('dog image', res.body.message);
//   } catch (err) {
//     console.log('error', err);
//   }
// })();

/// using async await with multiple request
(async () => {
  try {
    const dogBreed = await readFileAsync(`${__dirname}/dog_breed.txt`);
    console.log(`dog breed: ${dogBreed}`);

    const res1 = superagent.get(
      `https://dog.ceo/api/breed/${dogBreed}/images/random`
    );
    const res2 = superagent.get(
      `https://dog.ceo/api/breed/${dogBreed}/images/random`
    );

    const allRes = await Promise.all([res1, res2]);

    const dogImages = allRes.map((res) => res.body.message);
    console.log('dog images', dogImages);
  } catch (err) {
    console.log('error', err);
  }
})();
