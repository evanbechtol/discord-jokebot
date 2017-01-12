let fs = require('fs'),
    Promise = require('es6-promise').Promise;

module.exports = {
    getRandomLine: (file) => {
        let filename = '';

        if (file === 'joke') {
            filename = 'jokes.txt';
        } else if (file === 'rebuttal') {
            filename = 'rebuttal.txt';
        } else if (file === 'typing') {
            filename = 'typingLines.txt';
        } else {
            // nothing
        }

        let path = __dirname + '/../data/',
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
            let path = __dirname + '/../log/' + 'log.txt';
            fs.appendFile(path, data + '\r\n', (err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        });
    },

    readHelpFile: () => {
        let path = __dirname + '/../data/',
            filePath = path + 'help.txt';

        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let string = data.toString();

                    resolve(string);
                }
            });
        });
    }
};