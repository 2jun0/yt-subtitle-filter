/**
 * Extract string inbetween another.
 *
 * @param {string} haystack
 * @param {string} left
 * @param {string} right
 * @returns {string}
 */
export function between(haystack, left, right) {
  let pos
  if (left instanceof RegExp) {
    const match = haystack.match(left)
    if (!match) {
      return ''
    }
    pos = match.index + match[0].length
  } else {
    pos = haystack.indexOf(left)
    if (pos === -1) {
      return ''
    }
    pos += left.length
  }
  haystack = haystack.slice(pos)
  pos = haystack.indexOf(right)
  if (pos === -1) {
    return ''
  }
  haystack = haystack.slice(0, pos)
  return haystack
}

/**
 * Match begin and end braces of input JSON, return only json
 *
 * @param {string} mixedJson
 * @returns {string}
 */
export function cutAfterJSON(mixedJson) {
  let open, close
  if (mixedJson[0] === '[') {
    open = '['
    close = ']'
  } else if (mixedJson[0] === '{') {
    open = '{'
    close = '}'
  }

  if (!open) {
    throw new Error(
      `Can't cut unsupported JSON (need to begin with [ or { ) but got: ${mixedJson[0]}`,
    )
  }

  // States if the loop is currently in a string
  let isString = false

  // States if the current character is treated as escaped or not
  let isEscaped = false

  // Current open brackets to be closed
  let counter = 0

  let i
  for (i = 0; i < mixedJson.length; i++) {
    // Toggle the isString boolean when leaving/entering string
    if (mixedJson[i] === '"' && !isEscaped) {
      isString = !isString
      continue
    }

    // Toggle the isEscaped boolean for every backslash
    // Reset for every regular character
    isEscaped = mixedJson[i] === '\\' && !isEscaped

    if (isString) continue

    if (mixedJson[i] === open) {
      counter++
    } else if (mixedJson[i] === close) {
      counter--
    }

    // All brackets have been closed, thus end of JSON is reached
    if (counter === 0) {
      // Return the cut JSON
      return mixedJson.substr(0, i + 1)
    }
  }

  // We ran through the whole string and ended up with an unclosed bracket
  throw Error("Can't cut unsupported JSON (no matching closing bracket found)")
}
