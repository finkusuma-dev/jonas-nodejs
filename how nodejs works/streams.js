const http = require('http');
const fs = require('fs');

const server = http.createServer();

server.on('request', (req, res) => {
  /// stream file
  /// 1. Using readFile
  // fs.readFile('./file.txt', (err, data) => {
  //   if (err) res.end(err);
  //   res.end(data);
  // });

  /// 2. Using fs.createReadStream
  /// This is better option because it won't wait for the system to read
  ///   the whole file to send it like on the 1st option.
  // const readable = fs.createReadStream('file.txt');
  // readable.on('data', (data) => {
  //   res.write(data);
  // });
  // readable.on('end', () => {
  //   res.end();
  // });
  // readable.on('error', (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('file not found');
  // });

  const readable = fs.createReadStream('file.txt');
  readable.pipe(res);
});

server.listen(8000, () => {
  console.log('http server started at port 8000', 'http://127.0.0.1:8000');
});
