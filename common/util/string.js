/**
 * String utility
 *
 * A small module containing utilities to work with Strings
 */

/**
 * Return string with first letter capitalised
 *
 * @param  {String} str
 * @return {String}
 */
function upperFirst(str) {
  return str ? str.substr(0, 1).toUpperCase() + str.substr(1) : ''
}

/**
 * Return pluralised String
 *
 * @param  {String} str
 * @return {String}
 */
function pluralise(str) {
  let lastCharMatch = str.match(/([a-zA-Z]{1})[^a-zA-Z]*$/)

  if (!lastCharMatch) { return str }

  let val = lastCharMatch[0]
  let index = lastCharMatch.index + 1

  if (val === 'y') {
    return `${ str.substr(0, index - 1) }ies${ str.substr(index) }`
  }

  return `${ str.substr(0, index) }s${ str.substr(index) }`
}

/**
 * Return a String representing the given number padded with leading zeroes to
 * given length
 *
 * @param  {Number} n
 * @param  {Number} length
 * @return {String}
 */
function zeropad(n, width) {
  n = `${ n }`
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
}

/**
 * Return `a` or `an` depending on whether given string starts with a vowel
 *
 * @param  {String} string
 * @return {String}
 */
function getArticle(string) {
  return /^([aeiou])/i.test(string.substr(0, 1)) ? 'an' : 'a'
}

/**
 * Return an Array of map keys which values have been found in given String
 *
 * @param  {Object} map
 * @param  {String} string
 * @return {[String]}
 */
function tagsFromKeywordsSearch(string, map) {
  let out = []

  string = string.toLowerCase()

  for (let key in map) {
    for (let keyword of map[key]) {
      let negative = false

      keyword = keyword.toLowerCase()

      if (keyword.substr(0, 1) === '!') {
        keyword = keyword.substr(1)
        negative = true
      }

      if (string.indexOf(keyword) !== -1) {
        if (negative) {
          if (out.indexOf(keyword) !== -1) { out.splice(out.indexOf(keyword)) }
          continue
        }

        out.push(key)
        break
      }
    }
  }

  return out
}

/**
 * Ensure returned String ends with a rtailing slash
 *
 * @param  {String} str
 * @return {String}
 */
function ensureTrailingSlash(str) {
  return str.substr(-1) === '/' ? str : `${ str || '' }/`
}

/**
 * Remove trailing slash from String if found
 *
 * @param  {String} str
 * @return {String}
 */
function removeTrailingSlash(str) {
  return str.substr(-1) === '/' ? str.substr(0, str.length - 1) : str
}

/**
 * Remove trailing slash from String if found
 *
 * @param  {String} str
 * @return {String}
 */
function removeInitialSlash(str) {
  return str.substr(0, 1) === '/' ? str.substr(1) : str
}

module.exports = {
  upperFirst,
  pluralise,
  zeropad,
  getArticle,
  tagsFromKeywordsSearch,
  ensureTrailingSlash,
  removeTrailingSlash,
  removeInitialSlash
}