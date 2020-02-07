const csv = require('csv');
const fs = require('fs');
const { basename } = require('path');
const _ = require('lodash');

/**
 * @param {string} fn
 */
const readFile = async fn =>
  new Promise((resolve, reject) => {
    fs.readFile(fn, (err, data) => (err ? reject(err) : resolve(data)));
  });

/**
 * @param {string} fn
 */
const writeFile = async (fn, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(fn, data, (err, data) => (err ? reject(err) : resolve(data)));
  });

/**
 * @param {object} dataRow
 */
const filterByUserID = dataRow =>
  dataRow.reduce((vDocs, entry) => {
    const version = _.get(vDocs, '[User Id].version', -Infinity);
    const entryVersion = parseInt(entry.Version);
    if (entryVersion > version) {
      Object.assign(vDocs, { [entry['User Id']]: entry });
    }
    return vDocs;
  }, {});

/**
 * @param {string} csvFile
 * @param {string} insuranceCompany
 * @param {string} outputDirectory
 * @returns {function}
 */
const stringifyCallback = (csvFile, insuranceCompany, outputDirectory) => (
  transformErr,
  transformData
) => {
  if (transformErr) {
    process.exit(2);
  }
  const inputFile = basename(csvFile).split('.')[0];
  writeFile(
    `${outputDirectory}/${inputFile}-${insuranceCompany}.csv`,
    transformData
  );
};

/**
 * @param {string} csvFile
 * @param {string} outputDirectory
 * @returns {void}
 */
const transformCSV = async (csvFile, outputDirectory = __dirname) => {
  await readFile(csvFile)
    .then(contents => {
      const parserOptions = {
        columns: true,
      };
      csv.parse(contents, parserOptions, (err, data) => {
        if (err) {
          process.exit(1);
        } else {
          // Filtering by version happens first as it is an O(N) operation, that can reduce the data size for the O(NlogN) sorting operation.
          const filteredDocs = filterByUserID(data);
          const groupedDocs = _.groupBy(filteredDocs, 'Insurance Company');
          for (let InsuranceCompany in groupedDocs) {
            const sortedDocs = _.sortBy(
              groupedDocs[InsuranceCompany],
              'First and Last Name'
            );
            const callback = stringifyCallback(
              csvFile,
              InsuranceCompany,
              outputDirectory
            );
            csv.stringify(sortedDocs, callback);
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const fileIndex = process.argv.indexOf('--file');
if (fileIndex > -1) {
  const fileName =
    process.argv[fileIndex].split('=')[1] || process.argv[fileIndex + 1];

  if (fileName && fileName.length) {
    const outputDirectoryIndex = process.argv.indexOf('--outDir');
    if (outputDirectoryIndex > -1) {
      const outDir =
        process.argv[outputDirectoryIndex].split('=')[1] ||
        process.argv[outputDirectoryIndex + 1];

      if (fileName && fileName.length) {
        console.log(fileName, outDir);
        transformCSV(fileName, outDir);
      }
    }
  }
}

module.exports = transformCSV;
