let fs = require('fs'),
    Promise = require('es6-promise').Promise;

module.exports = {
    getRandomLine: () => {
        let filename = 'jokes.txt',
            path = __dirname + '/../data/',
            filePath = path + filename;

        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let string = data.toString(),
                        lines = string.split('\n');

                    resolve(lines[Math.floor(Math.random() * lines.length)]);
                }
            });
        });
    },
    writeToLog: (data) => {
        return new Promise((resolve, reject) => {
            let path = __dirname + '/log.txt';
            fs.appendFile(path, data + '\r\n', (err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        });
    }
};