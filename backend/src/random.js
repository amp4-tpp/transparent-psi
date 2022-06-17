const Alea = require('alea');

const shuffle = (arr) => {
    //  Fisher-Yates
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const generate = () => new Alea()();
const coinFlip = () => generate()  >= 0.5; 

module.exports = {generate, coinFlip, shuffle};