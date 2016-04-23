/* eslint console: 0*/
// import ready from 'domready';

// ready(() => document.querySelector('body').innerHTML = '<h1>Hello, World</h1>');
import papaparse from 'papaparse';

const completed = (results, file) => {
  console.log('file', file);
  console.log('results', results);
  return results;
};

function parse() {
  papaparse.parse('../data/coral_bleaching.csv', { complete: completed });
}

export default parse;
