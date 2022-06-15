const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomIntFromInterval = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
    sleep,
    randomIntFromInterval
}