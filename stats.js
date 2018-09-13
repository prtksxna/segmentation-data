(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//     wink-helpers
//     Low level helper functions for Javascript
//     array, object, and string.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-helpers”.
//
//     “wink-helpers” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-helpers” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-helpers”.
//     If not, see <http://www.gnu.org/licenses/>.

//
var helpers = Object.create( null );

// ### Private Functions

// #### Product Reducer (Callback)

// Callback function used by `reduce` inside the `product()` function.
// Follows the standard guidelines of `reduce()` callback function.
var productReducer = function ( prev, curr ) {
  var c,
      cmax = curr.length;
  var p,
      pmax = prev.length;
  var result = [];

  for ( p = 0; p < pmax; p += 1 ) {
    for ( c = 0; c < cmax; c += 1 ) {
      result.push( prev[ p ].concat( curr[ c ] ) );
    }
  }
  return ( result );
}; // productReducer()

// ### Public Function

// ### Array Helpers

helpers.array = Object.create( null);

// #### is Array

// Tests if argument `v` is a JS array; returns `true` if it is, otherwise returns `false`.
helpers.array.isArray = function ( v ) {
  return ( ( v !== undefined ) && ( v !== null ) && ( Object.prototype.toString.call( v ) === '[object Array]' ) );
}; // isArray()


// #### sorting helpers

// Set of helpers to sort either numbers or strings. For key/value pairs,
// the format for each element must be `[ key, value ]`.
// Sort helper to sort an array in ascending order.
helpers.array.ascending = function ( a, b ) {
  return ( a > b ) ? 1 :
            ( a === b ) ? 0 : -1;
}; // ascending()

// Sort helper to sort an array in descending order.
helpers.array.descending = function ( a, b ) {
  return ( b > a ) ? 1 :
            ( b === a ) ? 0 : -1;
}; // descending()

// Sort helper to sort an array of `[ key, value ]` in ascending order by **key**.
helpers.array.ascendingOnKey = function ( a, b ) {
  return ( a[ 0 ] > b[ 0 ] ) ? 1 :
            ( a[ 0 ] === b[ 0 ] ) ? 0 : -1;
}; // ascendingOnKey()

// Sort helper to sort an array of `[ key, value ]` in descending order by **key**.
helpers.array.descendingOnKey = function ( a, b ) {
  return ( b[ 0 ] > a[ 0 ] ) ? 1 :
            ( b[ 0 ] === a[ 0 ] ) ? 0 : -1;
}; // descendingOnKey()

// Sort helper to sort an array of `[ key, value ]` in ascending order by **value**.
helpers.array.ascendingOnValue = function ( a, b ) {
  return ( a[ 1 ] > b[ 1 ] ) ? 1 :
            ( a[ 1 ] === b[ 1 ] ) ? 0 : -1;
}; // ascendingOnValue()

// Sort helper to sort an array of `[ key, value ]` in descending order by **value**.
helpers.array.descendingOnValue = function ( a, b ) {
  return ( b[ 1 ] > a[ 1 ] ) ? 1 :
            ( b[ 1 ] === a[ 1 ] ) ? 0 : -1;
}; // descendingOnValue()

// The following two functions generate a suitable function for sorting on a single
// key or on a composite keys (max 2 only). Just a remider, the generated function
// does not sort on two keys; instead it will sort on a key composed of the two
// accessors.
// Sorts in ascending order on `accessor1` & `accessor2` (optional).
helpers.array.ascendingOn = function ( accessor1, accessor2 ) {
  if ( accessor2 ) {
    return ( function ( a, b ) {
      return ( a[ accessor1 ][ accessor2 ] > b[ accessor1 ][ accessor2 ] ) ? 1 :
              ( a[ accessor1 ][ accessor2 ] === b[ accessor1 ][ accessor2 ] ) ? 0 : -1;
    } );
  }
  return ( function ( a, b ) {
    return ( a[ accessor1 ] > b[ accessor1 ] ) ? 1 :
            ( a[ accessor1 ] === b[ accessor1 ] ) ? 0 : -1;
  } );
}; // ascendingOn()

// Sorts in descending order on `accessor1` & `accessor2` (optional).
helpers.array.descendingOn = function ( accessor1, accessor2 ) {
  if ( accessor2 ) {
    return ( function ( a, b ) {
      return ( b[ accessor1 ][ accessor2 ] > a[ accessor1 ][ accessor2 ] ) ? 1 :
              ( b[ accessor1 ][ accessor2 ] === a[ accessor1 ][ accessor2 ] ) ? 0 : -1;
    } );
  }
  return ( function ( a, b ) {
    return ( b[ accessor1 ] > a[ accessor1 ] ) ? 1 :
            ( b[ accessor1 ] === a[ accessor1 ] ) ? 0 : -1;
  } );
}; // descendingOn()

// #### pluck

// Plucks specified element from each element of an **array of array**, and
// returns the resultant array. The element is specified by `i` (default `0`) and
// number of elements to pluck are defined by `limit` (default `a.length`).
helpers.array.pluck = function ( a, key, limit ) {
  var k, plucked;
  k = a.length;
  var i = key || 0;
  var lim = limit || k;
  if ( lim > k ) lim = k;
  plucked = new Array( lim );
  for ( k = 0; k < lim; k += 1 ) plucked[ k ] = a[ k ][ i ];
  return plucked;
}; // pluck()

// #### product

// Finds the Cartesian Product of arrays present inside the array `a`. Therefore
// the array `a` must be an array of 1-dimensional arrays. For example,
// `product( [ [ 9, 8 ], [ 1, 2 ] ] )`
// will produce `[ [ 9, 1 ], [ 9, 2 ], [ 8, 1 ], [ 8, 2 ] ]`.
helpers.array.product = function ( a ) {
  return (
    a.reduce( productReducer, [ [] ] )
  );
};

// #### shuffle

// Randomly shuffles the elements of an array and returns the same.
// Reference: Chapter on Random Numbers/Shuffling in Seminumerical algorithms.
// The Art of Computer Programming Volume II by Donald E Kunth
helpers.array.shuffle = function ( array ) {
  var a = array;
  var balance = a.length;
  var candidate;
  var temp;

  while ( balance ) {
    candidate = Math.floor( Math.random() * balance );
    balance -= 1;

    temp = a[ balance ];
    a[ balance ] = a[ candidate ];
    a[ candidate ] = temp;
  }

  return ( a );
};


// ### Object Helpers

var objectKeys = Object.keys;
var objectCreate = Object.create;

helpers.object = Object.create( null );

// #### is Object

// Tests if argument `v` is a JS object; returns `true` if it is, otherwise returns `false`.
helpers.object.isObject = function ( v ) {
  return ( v && ( Object.prototype.toString.call( v ) === '[object Object]' ) ) ? true : false; // eslint-disable-line no-unneeded-ternary

}; // isObject()

// #### keys

// Returns keys of the `obj` in an array.
helpers.object.keys = function ( obj ) {
  return ( objectKeys( obj ) );
}; // keys()

// #### size

// Returns the number of keys of the `obj`.
helpers.object.size = function ( obj ) {
  return ( ( objectKeys( obj ) ).length );
}; // size()

// #### values

// Returns all values from each key/value pair of the `obj` in an array.
helpers.object.values = function ( obj ) {
  var keys = helpers.object.keys( obj );
  var length = keys.length;
  var values = new Array( length );
  for ( var i = 0; i < length; i += 1 ) {
    values[ i ] = obj[ keys[ i ] ];
  }
  return values;
}; // values()

// #### value Freq

// Returns the frequency of each unique value present in the `obj`, where the
// **key** is the *value* and **value** is the *frequency*.
helpers.object.valueFreq = function ( obj ) {
  var keys = helpers.object.keys( obj );
  var length = keys.length;
  var val;
  var vf = objectCreate( null );
  for ( var i = 0; i < length; i += 1 ) {
    val = obj[ keys[ i ] ];
    vf[ val ] = 1 + ( vf[ val ] || 0 );
  }
  return vf;
}; // valueFreq()

// #### table

// Converts the `obj` in to an array of `[ key, value ]` pairs in form of a table.
// Second argument - `f` is optional and it is a function, which is called with
// each `value`.
helpers.object.table = function ( obj, f ) {
  var keys = helpers.object.keys( obj );
  var length = keys.length;
  var pairs = new Array( length );
  var ak, av;
  for ( var i = 0; i < length; i += 1 ) {
    ak = keys[ i ];
    av = obj[ ak ];
    if ( typeof f === 'function' ) f( av );
    pairs[ i ] = [ ak, av ];
  }
  return pairs;
}; // table()

// ### Validation Helpers

helpers.validate = Object.create( null );

// Create aliases for isObject and isArray.
helpers.validate.isObject = helpers.object.isObject;
helpers.validate.isArray = helpers.array.isArray;

// #### isFiniteInteger

// Validates if `n` is a finite integer.
helpers.validate.isFiniteInteger = function ( n ) {
  return (
    ( typeof n === 'number' ) &&
    !isNaN( n ) &&
    isFinite( n ) &&
    ( n === Math.round( n ) )
  );
}; // isFiniteInteger()

// #### isFiniteNumber

// Validates if `n` is a valid number.
helpers.validate.isFiniteNumber = function ( n ) {
  return (
    ( typeof n === 'number' ) &&
    !isNaN( n ) &&
    isFinite( n )
  );
}; // isFiniteNumber()

// ### cross validation
/**
 *
 * Creates an instance of cross validator useful for machine learning tasks.
 *
 * @param {string[]} classLabels - array containing all the class labels.
 * @return {methods} object conatining set of API methods for tasks like evalutaion,
 * reset and metrics generation.
*/
helpers.validate.cross = function ( classLabels ) {
  // wink's const for unknown predictions!
  const unknown = 'unknown';
  // To ensure that metrics is not computed prior to evaluation.
  var evaluated = false;
  // The confusion matrix.
  var cm;
  var precision;
  var recall;
  var fmeasure;

  // The class labels is assigned to this variable.
  var labels;
  // The length of `labels` array.
  var labelCount;
  var labelsObj = Object.create( null );

  // Returned!
  var methods = Object.create( null );


  /**
   *
   * Resets the current instance for another round of evaluation; the class
   * labels defined at instance creation time are not touched.
   *
   * @return {undefined} nothing!
  */
  var reset = function ( ) {
    evaluated = false;
    cm = Object.create( null );
    precision = Object.create( null );
    recall = Object.create( null );
    fmeasure = Object.create( null );

    // Initialize confusion matrix and metrics.
    for ( let i = 0; i < labelCount; i += 1 ) {
      const row = labels[ i ];
      labelsObj[ row ] = true;
      cm[ row ] = Object.create( null );
      precision[ row ] = 0;
      recall[ row ] = 0;
      fmeasure[ row ] = 0;
      for ( let j = 0; j < labelCount; j += 1 ) {
        const col = labels[ j ];
        cm[ row ][ col ] = 0;
      }
    }
  }; // reset()

  /**
   *
   * Creates an instance of cross validator useful for machine learning tasks.
   *
   * @param {string} truth - the actual class label.
   * @param {string} guess - the predicted class label.
   * @return {boolean} returns true if the evaluation is successful. The evaluation
   * may fail if `truth` or `guess` is not in the array `classLabels` provided at
   * instance creation time; or if guess is equal to `unknown`.
  */
  var evaluate = function ( truth, guess ) {
    // If prediction failed then return false!
    if ( guess === unknown || !labelsObj[ truth ] || !labelsObj[ guess ] ) return false;
    // Update confusion matrix.
    if ( guess === truth ) {
      cm[ truth ][ guess ] += 1;
    } else {
      cm[ guess ][ truth ] += 1;
    }
    evaluated = true;
    return true;
  }; // evaluate()

  /**
   *
   * It computes a detailed metrics consisting of macro-averaged precision,
   * recall and f-measure along with their label-wise values and the confusion
   * matrix.
   *
   * @return {object} object containing macro-averaged `avgPrecision`, `avgRecall`,
   * `avgFMeasure` values along with other details such as label-wise values
   * and the confusion matrix. A value of `null` is returned if no evaluate()
   * has been called before.
  */
  var metrics = function ( ) {
    if ( !evaluated ) return null;
    // Numerators for every label; they are same for precision & recall both.
    var n = Object.create( null );
    // Only denominators differs for precision & recall
    var pd = Object.create( null );
    var rd = Object.create( null );
    // `row` and `col` of confusion matrix.
    var col, row;
    var i, j;
    // Macro average values for metrics.
    var avgPrecision = 0;
    var avgRecall = 0;
    var avgFMeasure = 0;

    // Compute label-wise numerators & denominators!
    for ( i = 0; i < labelCount; i += 1 ) {
      row = labels[ i ];
      for ( j = 0; j < labelCount; j += 1 ) {
        col = labels[ j ];
        if ( row === col ) {
          n[ row ] = cm[ row ][ col ];
        }
        pd[ row ] = cm[ row ][ col ] + ( pd[ row ] || 0 );
        rd[ row ] = cm[ col ][ row ] + ( rd[ row ] || 0 );
      }
    }
    // Ready to compute metrics.
    for ( i = 0; i < labelCount; i += 1 ) {
      row = labels[ i ];
      precision[ row ] = +( n[ row ] / pd[ row ] ).toFixed( 4 );
      // NaN can occur if a label has not been encountered.
      if ( isNaN( precision[ row ] ) ) precision[ row ] = 0;

      recall[ row ] = +( n[ row ] / rd[ row ] ).toFixed( 4 );
      if ( isNaN( recall[ row ] ) ) recall[ row ] = 0;

      fmeasure[ row ] = +( 2 * precision[ row ] * recall[ row ] / ( precision[ row ] + recall[ row ] ) ).toFixed( 4 );
      if ( isNaN( fmeasure[ row ] ) ) fmeasure[ row ] = 0;
    }
    // Compute thier averages, note they will be macro avegages.
    for ( i = 0; i < labelCount; i += 1 ) {
      avgPrecision += ( precision[ labels[ i ] ] / labelCount );
      avgRecall += ( recall[ labels[ i ] ] / labelCount );
      avgFMeasure += ( fmeasure[ labels[ i ] ] / labelCount );
    }
    // Return metrics.
    return (
      {
        // Macro-averaged metrics.
        avgPrecision: +avgPrecision.toFixed( 4 ),
        avgRecall: +avgRecall.toFixed( 4 ),
        avgFMeasure: +avgFMeasure.toFixed( 4 ),
        details: {
          // Confusion Matrix.
          confusionMatrix: cm,
          // Label wise metrics details, from those averages were computed.
          precision: precision,
          recall: recall,
          fmeasure: fmeasure
        }
      }
    );
  }; // metrics()

  if ( !helpers.validate.isArray( classLabels ) ) {
    throw Error( 'cross validate: class labels must be an array.' );
  }
  if ( classLabels.length < 2 ) {
    throw Error( 'cross validate: at least 2 class labels are required.' );
  }
  labels = classLabels;
  labelCount = labels.length;

  reset();

  methods.reset = reset;
  methods.evaluate = evaluate;
  methods.metrics = metrics;

  return methods;
}; // cross()

// ### Object Helpers

helpers.string = Object.create( null );

// Regex for [diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) removal.
var rgxDiacritical = /[\u0300-\u036f]/g;

/**
 *
 * Normalizes the token's value by converting it to lower case and stripping
 * the diacritical marks (if any).
 *
 * @param {string} str — that needs to be normalized.
 * @return {string} the normalized value.
 * @example
 * normalize( 'Nestlé' );
 * // -> nestle
*/
helpers.string.normalize = function ( str ) {
  return (
    str.toLowerCase().normalize( 'NFD' ).replace( rgxDiacritical, '' )
  );
}; // normalize()

module.exports = helpers;

},{}],2:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## Private

// ### accessor
/**
 *
 * @private
 * Returns the value from `data` that is accessed via `accessor`.
 *
 * @param {number} data — from where a value is extracted using `accessor`.
 * @param {(string|function)} [accessor=undefined] — It should be a property-name
 * contained in `data` or function; `undefined` means the `data` is returned as-is.
 * @return {number} — value from `data` according to `accessor`.
 *
*/
var value = function ( data, accessor ) {
  if ( accessor === undefined ) return data;
  if ( typeof accessor === 'string' || typeof accessor === 'number' ) return data[ accessor ];
  if ( typeof accessor === 'function' ) return accessor( data );
  throw Error( 'accessor: expecting undefined, string, number, or function, instead found: ' + ( typeof accessor ) );
}; // accessor()

module.exports = value;

},{}],3:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## probability

// ### aggregate
/**
 *
 * Aggregates two probability estimates from independent sources about the occurrence of
 * a **single** event **a**. It returns the aggregated probability of occurrence
 * of the event **a**. The assumption here is that the two probabilities
 * (estimates) are not correlated with each other and the **common prior**
 * probability of **a** is **0.5**.
 *
 * For a detailed explanation, refer to the paper titled
 * *[Bayesian Group Belief by Franz Dietrich](http://link.springer.com/article/10.1007/s00355-010-0453-x)*
 * published in Social Choice and Welfare October 2010, Volume 35, Issue 4, pp 595–626.
 *
 * @name probability.aggregate
 * @param {number} pa1 — first estimate of probability of occurrence of event **a**.
 * @param {number} pa2 — second estimate of probability of occurrence of event **a**.
 * @return {number} the aggregated probability.
 * @example
 * aggregate( 0.5, 0.6 );
 * // returns 0.6
 * aggregate( 0.5, 0.4 );
 * // returns 0.4
 * aggregate( 0.6, 0.6 );
 * // returns 0.6923076923076923
 * aggregate( 0.4, 0.6 );
 * // returns 0.5
 */
var aggregate = function ( pa1, pa2 ) {
  if ( ( typeof pa1 !== 'number' ) || ( pa1 < 0 ) || ( pa1 > 1 ) ) {
    throw Error( 'probability-aggregate: pa1 should be a number between 0 & 1, instead found: ' + JSON.stringify( pa1 ) );
  }
  if ( ( typeof pa2 !== 'number' ) || ( pa2 < 0 ) || ( pa2 > 1 ) ) {
    throw Error( 'probability-aggregate: pa2 should be a number between 0 & 1, instead found: ' + JSON.stringify( pa2 ) );
  }
  return ( ( pa1 * pa2 ) / ( ( pa1 * pa2 ) + ( ( 1 - pa1 ) * ( 1 - pa2 ) ) ) );
}; // aggregate()

module.exports = aggregate;

},{}],4:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## probability

// ### range4CI
/**
 *
 * Computes probability from the **observed** count of successes (`successCount`) out of the total count (`totalCount`)
 * along with its **range** for required level of Confidence Interval (CI)  i.e. `zscore` .
 * The range is the minimum and maximum probability values for given `zscore` or CI.
 *
 * These computations are based on approach specified in the Wilson's *Notes on
 * Probable Inference, The Law of Succession, and Statistical Inference*
 * published in ASA's Journal.
 *
 * For quick reference, typical value of `zscore` for 90% and 95% CI is approximately
 * 1.645 and 1.960 respectively.
 *
 * @name probability.range4CI
 * @param {number} successCount — observed count of successes out of
 * @param {number} totalCount — the total count.
 * @param {number} [zscore=1.645] — for the required level of CI.
 * @return {object} containing `probability`, `min` and `max`.
 * @example
 * range4CI( 1, 10 );
 * // returns {
 * //   probability: 0.18518871952479238,
 * //   min: 0.02263232984000629,
 * //   max: 0.34774510920957846
 * // }
 * range4CI( 10, 100 );
 * // returns {
 * //   probability: 0.1105389143431459,
 * //   min: 0.06071598345043355,
 * //   max: 0.16036184523585828
 * // }
 */
var range4CI = function ( successCount, totalCount, zscore ) {
  if ( ( typeof successCount !== 'number' ) || ( successCount <= 0 ) ) {
    throw Error( 'probability-range4CI: successCount should be a number > 0, instead found: ' + JSON.stringify( successCount ) );
  }
  if ( ( typeof totalCount !== 'number' ) || ( totalCount <= 0 ) ) {
    throw Error( 'probability-range4CI: totalCount should be a number > 0, instead found: ' + JSON.stringify( totalCount ) );
  }
  if ( totalCount < successCount ) {
    throw Error( 'probability-range4CI: totalCount should be >= successCount, instead found: ' + JSON.stringify( totalCount ) );
  }
  var z = Math.abs( zscore || 1.645 );
  var t = ( z * z ) / totalCount;
  var p0 = successCount / totalCount;
  var q0 = 1 - p0;
  var delta = Math.sqrt( ( p0 * q0 * t ) + ( ( t * t ) / 4 ) );

  var min = ( p0 + ( t / 2 ) - delta ) / ( t + 1 );
  var max = ( p0 + ( t / 2 ) + delta ) / ( t + 1 );

  return {
    probability: ( p0 + ( t / 2 ) ) / ( t + 1 ),
    min: min,
    max: max
  };
}; // range4CI()

module.exports = range4CI;

},{}],5:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load five number summary.
var fiveNumSummary = require( './stats-five-num-summary.js' );
// Load accessor.
var value = require( './accessor.js' );

// ### Boxplot

/**
 *
 * Performs complete [boxplot](https://en.wikipedia.org/wiki/Box_plot) analysis
 * including computation of notches and outliers.
 *
 * @name stats.boxplot
 * @param {array} sortedData — sorted in ascending order of value.
 * @param {number} [coeff=1.5] — used for outliers computation.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `sortedData` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @returns {object} consisting of `min`, `q1`, `median`, `q3`,
 * `max`, `iqr`, `range`, `size` along with `leftNotch`, and `rightNotch`.
 * The `leftOutliers/rightOutliers` (object), if present, contains the `count`, `fence`
 * and `begin/end` indexes to `sortedData` for easy extraction of exact values.
 * @example
 * var data = [
 *   -12, 14, 14, 14, 16, 18, 20, 20, 21, 23, 27, 27, 27, 29, 31,
 *   31, 32, 32, 34, 36, 40, 40, 40, 40, 40, 42, 51, 56, 60, 88
 * ];
 * boxplot( data );
 * returns {
 * //   min: -12, q1: 20, median: 31, q3: 40, max: 88,
 * //   iqr: 20, range: 100, size: 30,
 * //   leftOutliers: { begin: 0, end: 0, count: 1, fence: 14 },
 * //   rightOutliers: { begin: 29, end: 29, count: 1, fence: 60 },
 * //   leftNotch: 25.230655727612252,
 * //   rightNotch: 36.76934427238775
 * // }
*/
var boxplot = function ( sortedData, coeff, accessor ) {
  var fns = fiveNumSummary( sortedData, accessor );
  var coef = Math.abs( coeff || 1.5 );
  var i;
  var iqrXcoef = fns.iqr * coef;
  var leftFence = fns.q1 - iqrXcoef;
  var leftOutliers, rightOutliers;
  var rightFence = fns.q3 + iqrXcoef;

  var ci = ( 1.58 * fns.iqr ) / ( Math.sqrt( fns.size ) );
  // Compute outliers only and only if `iqrXcoef` is greater than `0`, because
  // with `iqrXcoef` as `0`, fences will become `q1` and `q3` respectively!
  if ( iqrXcoef > 0 ) {
    // Compute Left outliers, if any.
    for ( i = 0; value( sortedData[ i ], accessor ) < leftFence; i += 1 ) ;
    leftOutliers = { begin: 0, end: ( i - 1 ), count: i, fence: value( sortedData[ i ], accessor ) };
    // Compute right outliers, if any.
    for ( i = fns.size - 1; value( sortedData[ i ], accessor ) > rightFence; i -= 1 ) ;
    rightOutliers = { begin: ( i + 1 ), end: ( fns.size - 1 ), count: ( fns.size - i - 1 ), fence: value( sortedData[ i ], accessor ) };
    // Add left and/or right outliers to `rs`.
    if ( leftOutliers.count ) fns.leftOutliers = leftOutliers;
    if ( rightOutliers.count ) fns.rightOutliers = rightOutliers;
  }
  // Add notches.
  fns.leftNotch = fns.median - ci;
  fns.rightNotch = fns.median + ci;
  return ( fns );
}; // boxplot()

module.exports = boxplot;

},{"./accessor.js":2,"./stats-five-num-summary.js":6}],6:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load accessor.
var value = require( './accessor.js' );
// Load percentile.
var percentile = require( './stats-percentile.js' );


// ### fiveNumSummary
/**
 *
 * Returns the [five number summary](https://en.wikipedia.org/wiki/Five-number_summary) from the `sortedData`.
 *
 * @name stats.fiveNumSummary
 * @param {array} sortedData — sorted in ascending order of value.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @returns {number} 5-number summary consisting of `min`, `q1`, `median`, `q3`,
 * `max` along with `iqr`, `range`, and `size`.
 * @example
 * fiveNumSummary( [ 1, 1, 2, 2, 3, 3, 4, 4 ] );
 * // returns {
 * //   q1: 1.25, median: 2.5, q3: 3.75, iqr: 2.5,
 * //   size: 8, min: 1, max: 4, range: 3
 * // }
*/
var fiveNumSummary = function ( sortedData, accessor ) {
  var fns = Object.create( null );
  fns.q1 = percentile( sortedData, 0.25, accessor );
  fns.median = percentile( sortedData, 0.50, accessor );
  fns.q3 = percentile( sortedData, 0.75, accessor );
  fns.iqr = fns.q3 - fns.q1;
  fns.size = sortedData.length;
  fns.min = value( sortedData[ 0 ], accessor );
  fns.max = value( sortedData[ fns.size - 1 ], accessor );
  fns.range = fns.max - fns.min;

  return ( fns );
}; // fiveNumSummary()

module.exports = fiveNumSummary;

},{"./accessor.js":2,"./stats-percentile.js":13}],7:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load percentile.
var percentile = require( './stats-percentile.js' );
// Load accessor.
var value = require( './accessor.js' );
// Load mad.
var mad = require( './stats-mad.js' );


// ### distribution
/**
 *
 * Internal function to compute distribution from `bin` and `binWidth`.
 *
 * @param {number} bins — number of bins as computed by `histogram()`.
 * @param {number} binWidth — width of each bin.
 * @param {array} sortedData — sorted in ascending order of value.
 * @param {object} rs — robust stats containing `min`, `size`, etc.
 * @param {number} precision — of the data.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @returns {object} histogram conatining arrays `classes` and corresponding `frequencies`.
 * Each element of `classes` array is an object having `min/mid/max` values.
 * @private
*/
var distribution = function ( bins, binWidth, sortedData, rs, precision, accessor ) {
  // Helpers.
  var cutoff, i, k, limit, mid, min;
  // Hold x axis and y axis values.
  var x, y;
  // Distribution object.
  var dist = Object.create( null );

  // Find distribution now.
  x = new Array( bins );
  y = new Array( bins );
  cutoff = new Array( bins );
  limit = +( rs.min + binWidth ).toFixed( precision );
  min = +( rs.min ).toFixed( precision );
  for ( i = 0; i < bins; i += 1 ) {
   y[ i ] = 0;
   mid = +( limit - ( binWidth / 2 ) ).toFixed( precision );
   x[ i ] = { min: min, mid: mid, max: limit };
   cutoff[ i ] = limit;
   min = +( min + binWidth).toFixed( precision );
   limit = +( limit + binWidth).toFixed( precision );
  }
  i = 0;
  for ( k = 0; k < bins; k += 1 ) {
    // > REVIEW: Make it faster by deploying binary search approach.
    for ( ; ( ( i < rs.size ) && ( value( sortedData[ i ], accessor ) <= cutoff[ k ] ) ); i += 1 ) {
      y[ k ] += 1;
    }
  }

  dist.classes = x;
  dist.frequencies = y;
  return ( dist );
}; // distribution()


// ### histogram
/**
 *
 * Generates histogram using Freedman–Diaconis method.
 * If both IQR and MAD are `0` then it automatically
 * switches to Sturges' Rule while ensuring minimum of 5 bins.
 * It attempts to reduce excessive sparsity of distribution,
 * if any, by adjusting the number of bins using Sturges' Rule.
 *
 * @name stats.histogram
 * @param {array} sortedData — sorted in ascending order of value.
 * @param {number} [dataPrecision=0] — typically the minumum number of
 * decimal places observed in the `sortedData`.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @returns {object} conatining arrays `classes` and the corresponding `frequencies`.
 * Each element of `classes` array is an object with values for `min/max (class intervals)`
 * and `mid` point of a class. <br/><br/>In addition, the returned object
 * contains useful statistics like `q1`, `q3`, `iqr`, `min`, `max`, and `range`.
 * @example
 * var data = [
 *   12, 14, 14, 14, 16, 18, 20, 20, 21, 23, 27, 27, 27, 29, 31,
 *   31, 32, 32, 34, 36, 40, 40, 40, 40, 40, 42, 51, 56, 60, 65
 * ];
 * histogram( data );
 * // returns {
 * //   classes: [
 * //     { min: 12, mid: 19, max: 25 },
 * //     { min: 25, mid: 32, max: 38 },
 * //     { min: 38, mid: 45, max: 51 },
 * //     { min: 51, mid: 58, max: 64 },
 * //     { min: 64, mid: 71, max: 77 } ],
 * //   frequencies: [ 10, 10, 7, 2, 1 ],
 * //   q1: 20,  q3: 40, iqr: 20, size: 30, min: 12, max: 65,range: 53
 * // }
*/
var histogram = function ( sortedData, dataPrecision, accessor ) {
  var rs = Object.create( null );
  rs.q1 = percentile( sortedData, 0.25, accessor );
  rs.q3 = percentile( sortedData, 0.75, accessor );
  rs.iqr = ( rs.q3 - rs.q1 );
  rs.size = sortedData.length;
  rs.min = value( sortedData[ 0 ], accessor );
  rs.max = value( sortedData[ rs.size - 1 ], accessor );
  rs.range = ( rs.max - rs.min );
  // The histogram.
  var histo;
  // Number of bins.
  var bins;
  // Class interval or bin width.
  var binWidth = rs.iqr;
  // The `precision` is extremely important to get a quality histogram - in terms
  // of number of classes and counting data points in a class interval.
  var precision = Math.round( Math.abs( dataPrecision || 0 ) );
  // Compute `bins` and `binWidth`.
  if ( ( binWidth === 0 ) ) {
    rs.mad = mad( sortedData, accessor );
    binWidth = 2 * rs.mad;
  }

  if ( binWidth > 0 ) {
    // Apply Freedman–Diaconis formula.
    binWidth = 2 * binWidth * Math.pow( rs.size, -( 1 / 3 ) );
    // Adjust `binWidth` according to the `precision`.
    binWidth = +binWidth.toFixed( precision );
    if ( binWidth === 0 ) binWidth = 1;
    bins = Math.ceil( rs.range / binWidth );
    histo = distribution( bins, binWidth, sortedData, rs, precision, accessor );
    // Check how sparse is the distribution - # of 0s > 20% of the total frequencies.
    // If yes then attempt its reduction by using the Sturges' Rule (as above).
    if ( histo.frequencies.filter( function ( e ) { return ( e === 0 ); } ).length > histo.frequencies.length * 0.20 ) { // eslint-disable-line
      // Sparse! Apply Sturge's Rule now.
      bins = Math.max( Math.ceil( Math.log2( rs.size ) + 1 ), 5 );
      binWidth = rs.range /  bins;
      binWidth = +binWidth.toFixed( precision );
      if ( binWidth === 0 ) binWidth = 1;
      bins = Math.ceil( rs.range / binWidth );
      histo = distribution( bins, binWidth, sortedData, rs, precision, accessor );
    }
  } else {
    // Nothing is working out, downgrade to Sturges' Rule, but ensure minimum 5 bins.
    bins = Math.max( Math.ceil( Math.log2( rs.size ) + 1 ), 5 );
    binWidth = rs.range /  bins;
    // Adjust `binWidth` according to `precision` and recompute everything.
    binWidth = +binWidth.toFixed( precision );
    if ( binWidth === 0 ) binWidth = 1;
    bins = Math.ceil( rs.range / binWidth );
    histo = distribution( bins, binWidth, sortedData, rs, precision, accessor );
  }

  return ( Object.assign( histo, rs ) );
}; // histogram()

module.exports = histogram;

},{"./accessor.js":2,"./stats-mad.js":8,"./stats-percentile.js":13}],8:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load percentile.
var percentile = require( './stats-percentile.js' );
// Load accessor.
var value = require( './accessor.js' );
// Load wink helpers for sort helpers.
var helpers = require( 'wink-helpers' );


// ### mad
/**
 *
 * Returns the median of the `sortedData`.
 *
 * @name stats.mad
 * @param {array} sortedData — sorted in ascending order of value.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @returns {number} median of the `sortedData`.
 * @example
 * mad( [ 1, 1, 2, 2, 3, 3, 4, 4 ] );
 * // returns 1
*/
var mad = function ( sortedData, accessor ) {
  var median = percentile( sortedData, 0.5, accessor );
  // Absolute Difference From Median.
  var adfm = new Array( sortedData.length );
  var di;
  for ( var i = 0, imax = sortedData.length; i < imax; i += 1 ) {
      di = value( sortedData[ i ], accessor );
      adfm[ i ] = Math.abs( di - median );
  }
  adfm.sort( helpers.array.ascending );
  // Compute mad from the median of adfm now and return the same. Note, no accessor
  // is required for `adfm`.
  return ( percentile( adfm, 0.50 ) );
}; // mad()

module.exports = mad;

},{"./accessor.js":2,"./stats-percentile.js":13,"wink-helpers":1}],9:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load accessor.
var value = require( './accessor.js' );
// Load wink helpers for validation.
var helpers = require( 'wink-helpers' );

// ### max
/**
 *
 * Finds the maximum value in the `x` array.
 *
 * @name stats.max
 * @param {array} x — array containing 1 or more elements.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @return {object} maximum value from array `x`.
 * @example
 * max( [ 99, 1, -1, +222, 0, -99 ] )
 * // returns 222
 * max( [ { x: 33 }, { x: 11 }, { x:44 } ], 'x' )
 * // returns 44
 */
var max = function ( x, accessor ) {
  var maximum = -Infinity;
  var xi;

  if ( !helpers.array.isArray( x ) || !x.length ) {
    throw Error( 'stats-max: x should be an array of length > 0, instead found: ' + JSON.stringify( x ) );
  }

  for ( var i = 0, imax = x.length; i < imax; i += 1 ) {
    xi = value( x[ i ], accessor );
    maximum = ( maximum < xi ) ? xi : maximum;
  }

  return maximum;
}; // max()

module.exports = max;

},{"./accessor.js":2,"wink-helpers":1}],10:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load accessor.
var value = require( './accessor.js' );
// Load wink helpers for validation.
var helpers = require( 'wink-helpers' );

// ### mean
/**
 *
 * Comuptes the mean of numbers contained in the `x` array.
 * The computations are inspired by the method proposed by [B. P. Welford](http://dx.doi.org/10.1080/00401706.1962.10490022).
 *
 * @name stats.mean
 * @param {array} x — array containing 1 or more elements.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @return {number} mean value.
 * @example
 * mean( [ 2, 3, 5, 7 ] )
 * // returns 4.25
 * mean( [ { x: 2 }, { x: 3 }, { x: 5 }, { x: 7 } ], 'x' )
 * // returns 4.25
 */
var mean = function ( x, accessor ) {
  var xi;
  var mean1 = 0;

  if ( !helpers.array.isArray( x ) || !x.length ) {
    throw Error( 'stats-mean: x should be an array of length > 0, instead found: ' + JSON.stringify( x ) );
  }

  for ( var i = 0, imax = x.length; i < imax; i += 1 ) {
    xi = value( x[ i ], accessor );
    mean1 += ( xi - mean1 ) / ( i + 1 );
  }

  return mean1;
}; // max()

module.exports = mean;

},{"./accessor.js":2,"wink-helpers":1}],11:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load percentile.
var percentile = require( './stats-percentile.js' );


// ### median
/**
 *
 * Returns the median of the `sortedData`.
 *
 * @name stats.median
 * @param {array} sortedData — sorted in ascending order of value.
 * @param {(string|number|function)} [accessor=undefined] — Useful when each element of
 * `sortedData` is an object or an array instead of number. If it is an object
 * then it should be the key (string) to access the value; or if it is an array
 * then it should be the index (number) to access the value; or it should be a function
 * that extracts the value from the element passed to it.
 * @returns {number} median of the `sortedData`.
 * @example
 * median( [ 1, 1, 2, 2, 3, 3, 4, 4 ] );
 * // returns 2.5
*/
var median = function ( sortedData, accessor ) {
  return ( percentile( sortedData, 0.50, accessor ) );
}; // median()

module.exports = median;

},{"./stats-percentile.js":13}],12:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load accessor.
var value = require( './accessor.js' );
// Load wink helpers for validation.
var helpers = require( 'wink-helpers' );

// ### min
/**
 *
 * Finds the minimum value in the `x` array.
 *
 * @name stats.min
 * @param {array} x — array containing 1 or more elements.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @return {object} minimum value from array `x`.
 * @example
 * min( [ 99, 1, -1, +222, 0, -99 ] )
 * // returns -99
 * min( [ { x: 33 }, { x: 11 }, { x:44 } ], 'x' )
 * // returns 11
 */
var min = function ( x, accessor ) {
  var minimum = Infinity;
  var xi;

  if ( !helpers.array.isArray( x ) || !x.length ) {
    throw Error( 'stats-min: x should be an array of length > 0, instead found: ' + JSON.stringify( x ) );
  }

  for ( var i = 0, imax = x.length; i < imax; i += 1 ) {
    xi = value( x[ i ], accessor );
    minimum = ( minimum > xi ) ? xi : minimum;
  }

  return minimum;
}; // min()

module.exports = min;

},{"./accessor.js":2,"wink-helpers":1}],13:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load accessor.
var value = require( './accessor.js' );
// Load wink helpers for validation.
var helpers = require( 'wink-helpers' );

// ### Percentile
/**
 *
 * Returns the `q`<sup>th</sup> percentile from the `sortedData`. The computation is
 * based on Method 11 described in [Quartiles in Elementary Statistics](https://ww2.amstat.org/publications/jse/v14n3/langford.html)
 * by Eric Langford published in Journal of Statistics Education Volume 14, Number 3 (2006).
 *
 * @name stats.percentile
 * @param {array} sortedData — sorted in ascending order of value.
 * @param {number} q — should be between 0 and 1 indicating percentile;
 * for example, to get 25<sup>th</sup> percentile, it should be 0.25.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @returns {number} `q`<sup>th</sup> percentile of `sortedData`.
 * @example
 * percentile( [ 1, 1, 2, 2, 3, 3, 4, 4 ], 0.25 );
 * // returns 1.25
 * percentile( [ 1, 1, 2, 2, 3, 3, 4, 4 ], 0.75 );
 * // returns 3.75
*/
var percentile = function ( sortedData, q, accessor ) {
  if ( !helpers.array.isArray( sortedData ) || !sortedData.length ) {
    throw Error( 'stats-percentile: sortedData should be an array of length > 0, instead found: ' + ( typeof sortedData ) );
  }
  if ( ( typeof q !== 'number' ) || ( q <= 0 ) || ( q >= 1 ) ) {
    throw Error( 'stats-percentile: q should be a number between 0 & 1, instead found: ' + JSON.stringify( q ) );
  }
  // Temp variables to hold dec and int part of count*quartile respectively;
  // j_1 is `j - 1`.
  var g, j, j_1; // eslint-disable-line
  // Data length - n plus 1.
  var nP1 = sortedData.length + 1;
  // The np1 x quartile - for above computation.
  var nq = nP1 * q;
  // Compute percentile.
  j = Math.floor( nq );
  g = ( nq - j ).toFixed( 2 );
  j_1 = Math.max( 0, ( j - 1 ) ); // eslint-disable-line
  j = Math.min( j, ( sortedData.length - 1 ) );
  return ( ( ( 1 - g ) * value( sortedData[ j_1 ], accessor ) ) + ( g * value( sortedData[ j ], accessor ) ) );
}; // percentile()

module.exports = percentile;

},{"./accessor.js":2,"wink-helpers":1}],14:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## stats

// Load accessor.
var varianceXn = require( './stats-varianceXn.js' );

// ### stdev
/**
 *
 * Comuptes the sample standard deviation of numbers contained in the `x` array.
 * The computations are inspired by the method proposed by [B. P. Welford](http://dx.doi.org/10.1080/00401706.1962.10490022).
 *
 * @name stats.stdev
 * @param {array} x — array containing 1 or more elements.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @return {number} standard deviation of sample.
 * @example
 * stdev( [ 2, 3, 5, 7 ] )
 * // returns 2.217355782608345
 * stdev( [ { x: 2 }, { x: 3 }, { x: 5 }, { x: 7 } ], 'x' )
 * // returns 2.217355782608345
 */
var stdev = function ( x, accessor ) {
  var vXn = varianceXn( x, accessor );
  return ( vXn.size > 1 ) ? Math.sqrt( vXn.varianceXn / ( vXn.size - 1 ) ) : 0;
}; // stdev()

module.exports = stdev;

},{"./stats-varianceXn.js":15}],15:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// Load accessor.
var value = require( './accessor.js' );
// Load wink helpers for validation.
var helpers = require( 'wink-helpers' );

// ### varianceXn
/**
 *
 * @private
 * Comuptes the population `variance * size` of numbers contained in the `x` array.
 * The computations are inspired by the method proposed by [B. P. Welford](http://dx.doi.org/10.1080/00401706.1962.10490022).
 *
 * @param {array} x — array containing 1 or more elements.
 * @param {(string|number|function)} [accessor=undefined] — required when elements of
 * `x` are objects or arrays instead of numbers.
 * For objects, use key (string) to access the value; in case of arrays, use
 * index (number) to access the value; or it could be a function
 * that extracts the value from the element passed to it.
 * @return {object} containing `varianceXn` and `size`.
 *
 * @example
 * varianceXN( [ 2, 3, 5, 7 ] );
 * // returns { varianceXn: 14.749999999999998, size: 4 }
 */
var varianceXn = function ( x, accessor ) {
  var mean = 0;
  var varianceXn1 = 0;
  var prevMean;
  var i, imax, xi;
  var obj = Object.create( null );

  if ( !helpers.array.isArray( x ) || !x.length ) {
    throw Error( 'stats-variance: x should be an array of length > 0, instead found: ' + JSON.stringify( x ) );
  }

  for ( i = 0, imax = x.length; i < imax; i += 1 ) {
    xi = value( x[ i ], accessor );
    prevMean = mean;
    mean += ( xi - mean ) / ( i + 1 );
    varianceXn1 += ( xi - prevMean ) * ( xi - mean );
  }

  obj.varianceXn = varianceXn1;
  obj.size = imax;
  return obj;
}; // varianceXn()

module.exports = varianceXn;

},{"./accessor.js":2,"wink-helpers":1}],16:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### cov (Covariance)
/**
 *
 * Covariance — **cov** is a higher order function that returns an
 * object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **covariance** between `x` and `y` values passed to it in real-time.
 * Probe the sample covariance anytime using `value()`, which may be reset via `reset()`.
 *
 * Number of decimals in the returned numerical values can be configured by defining
 * `fractionDigits` as parameter in `result()` and `value()`. Its default value is **4**.
 *
 * The `result()` returns an object containing sample covariance `cov`, along with
 * `meanX`, `meanY` and `size` of data i.e. number of x & y pairs. It also contains
 * population covariance `covp`.
 *
 * @name streaming.cov
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var covariance = cov();
 * covariance.compute( 10, 80 );
 * covariance.compute( 15, 75 );
 * covariance.compute( 16, 65 );
 * covariance.compute( 18, 50 );
 * covariance.compute( 21, 45 );
 * covariance.compute( 30, 30 );
 * covariance.compute( 36, 18 );
 * covariance.compute( 40, 9 );
 * covariance.result();
 * // returns { size: 8,
 * //   meanX: 23.25,
 * //   meanY: 46.5,
 * //   cov: -275.8571,
 * //   covp: -241.375
 * // }
 */
var covariance = function () {
  var meanX = 0;
  var meanY = 0;
  var covXY = 0;
  var items = 0;
  // Returned!
  var methods = Object.create( null );

  methods.compute = function ( xi, yi ) {
    var dx, dy;
    items += 1;
    dx = xi - meanX;
    dy = yi - meanY;
    meanX += dx / items;
    meanY += dy / items;
    covXY += dx * ( yi - meanY );
    return undefined;
  }; // compute()

  // This returns the sample standard deviation.
  methods.value = function ( fractionDigits ) {
    var fd = fractionDigits || 4;
    return ( items > 1 ) ? +( covXY / ( items - 1 ) ).toFixed( fd ) : 0;
  }; // value()

  // This returns the sample covariance along with host of other statistics.
  methods.result = function ( fractionDigits ) {
    var obj = Object.create( null );
    var fd = fractionDigits || 4;
    var cov = ( items > 1 ) ? ( covXY / ( items - 1 ) ) : 0;
    var covp = ( items ) ? ( covXY / items ) : 0;

    obj.size = items;
    obj.meanX = +meanX.toFixed( fd );
    obj.meanY = +meanY.toFixed( fd );
    // Sample covariance.
    obj.cov = +cov.toFixed( fd );
    // Population covariance.
    obj.covp = +covp.toFixed( fd );

    return obj;
  }; // result()

  methods.reset = function () {
    meanX = 0;
    meanY = 0;
    covXY = 0;
    items = 0;
  }; // reset()

  return methods;
}; // covariance()

module.exports = covariance;

},{}],17:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// Load wink helpers for object to array conversion & sorting.
var helpers = require( 'wink-helpers' );

// ### freqTable
/**
 *
 * It is a higher order function that returns an object containing `build()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `build()` to construct a frequency table from value of data items passed to it in real-time.
 * Probe the object containing data-item/frequency pairs using `value()`, which may be reset via `reset()`.
 *
 * The `result()` returns an object containing the frequency `table` sorted in descending order of category counts or frequency, along
 * with it's `size`, `sum` of all counts, `x2` - chi-squared statistic, `df` - degree of freedom, and the
 * `entropy`.
 *
 * The `x2` along with the `df` can be used test the hypothesis that "the distribution is a uniform one". The
 * `percentage` in `table` give the percentage of a category count against the `sum`; and `expected` is the count
 * assuming an uniform distribution.
 *
 * @name streaming.freqTable
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var ft = freqTable();
 * ft.build( 'Tea' );
 * ft.build( 'Tea' );
 * ft.build( 'Tea' );
 * ft.build( 'Pepsi' );
 * ft.build( 'Pepsi' );
 * ft.build( 'Gin' );
 * ft.build( 'Coke' );
 * ft.build( 'Coke' );
 * ft.value();
 * // returns { Tea: 3, Pepsi: 2, Gin: 1, Coke: 2 }
 * ft.result();
 * // returns {
 * //  table: [
 * //   { category: 'Tea', observed: 3, percentage: 37.5, expected: 2 },
 * //   { category: 'Pepsi', observed: 2, percentage: 25, expected: 2 },
 * //   { category: 'Coke', observed: 2, percentage: 25, expected: 2 },
 * //   { category: 'Gin', observed: 1, percentage: 12.5, expected: 2 }
 * //  ],
 * //  size: 4,
 * //  sum: 8,
 * //  x2: 1,
 * //  df: 3,
 * //  entropy: 1.9056390622295665
 * // }
 */
var freqTable = function () {
  var obj = Object.create( null );
  var methods = Object.create( null );
  var sum = 0;

  methods.build = function ( x ) {
    obj[ x ] = 1 + ( obj[ x ] || 0 );
    sum += 1;
    return undefined;
  }; // compute()

  methods.value = function () {
    return obj;
  }; // value()

  methods.result = function () {
    var t = helpers.object.table( obj );
    var imax = t.length;
    var table = new Array( imax );
    var expectedVal = sum / imax;
    var x2 = 0;
    var entropy = 0;
    var p;
    var diff;
    var ft = Object.create( null );

    t.sort( helpers.array.descendingOnValue );
    for ( var i = 0;  i < imax; i += 1 ) {
      table[ i ] = Object.create( null );
      table[ i ].category = t[ i ][ 0 ];
      table[ i ].observed = t[ i ][ 1 ];
      p = t[ i ][ 1 ] / sum;
      table[ i ].percentage = ( p * 100 );
      table[ i ].expected = expectedVal;
      diff = ( t[ i ][ 1 ] - expectedVal );
      x2 += ( diff * ( diff / expectedVal ) );
      entropy += -p * Math.log2( p );
    }

    ft.table = table;
    ft.size = imax;
    ft.sum = sum;
    ft.x2 = +x2.toFixed( 3 );
    ft.df = ( imax - 1 );
    ft.entropy = entropy;

    return ft;
  }; // result()

  methods.reset = function () {
    obj = Object.create( null );
    sum = 0;
  }; // reset()

  methods.compute = methods.build;
  return methods;
}; // freqTable()

module.exports = freqTable;

},{"wink-helpers":1}],18:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### max
/**
 *
 * It is a higher order function that returns an object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **maximum** value of data items passed to it in real-time.
 * Probe the maximum anytime using `value()`, which may be reset via `reset()`.
 * The `result()` returns an object containing `max`.
 *
 * @name streaming.max
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var maximum = max();
 * maximum.compute( 3 );
 * maximum.compute( 6 );
 * maximum.value();
 * // returns 6
 * maximum.result();
 * // returns { max: 6 }
 */
var max = function () {
  var maximum = -Infinity;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    maximum = ( maximum < di ) ? di : maximum;
    return undefined;
  }; // compute()

  methods.value = function () {
    return maximum;
  }; // value()

  methods.result = function () {
    var obj = Object.create( null );
    obj.max = maximum;
    return obj;
  }; // result()

  methods.reset = function () {
    maximum = -Infinity;
  }; // reset()

  return methods;
}; // max()

module.exports = max;

},{}],19:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### mean
/**
 *
 * It is a higher order function that returns an object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **mean** aka average value of data items passed to it in real-time.
 * Probe the mean anytime using `value()`, which may be reset via `reset()`.
 * The computations are inspired by the method proposed by [B. P. Welford](http://dx.doi.org/10.1080/00401706.1962.10490022).
 *
 * The `result()` returns an object containing sample `mean` along with `size` of data.
 *
 * @name streaming.mean
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var avg = mean();
 * avg.compute( 2 );
 * avg.compute( 3 );
 * avg.compute( 5 );
 * avg.compute( 7 );
 * avg.value();
 * // returns 4.25
 * avg.result();
 * // returns { n: 4, mean: 4.25 }
 */
var mean = function () {
  var mean1 = 0;
  var items = 0;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    items += 1;
    mean1 += ( di - mean1 ) / items;
    return undefined;
  }; // compute()

  methods.value = function () {
    return mean1;
  }; // value()

  methods.result = function () {
    var obj = Object.create( null );
    obj.size = items;
    obj.mean = mean1;
    return obj;
  }; // result()

  methods.reset = function () {
    mean1 = 0;
    items = 0;
  }; // reset()

  return methods;
}; // mean()

module.exports = mean;

},{}],20:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### min
/**
 *
 * It is a higher order function that returns an object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **minimum** value of data items passed to it in real-time.
 * Probe the minimum anytime using `value()`, which may be reset via `reset()`.
 * The `result()` returns an object containing `min`.
 *
 * @name streaming.min
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var minimum = min();
 * minimum.compute( 3 );
 * minimum.compute( 6 );
 * minimum.value();
 * // returns 3
 * minimum.result();
 * // returns { min: 3 }
 */
var min = function () {
  var minimum = Infinity;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    minimum = ( minimum > di ) ? di : minimum;
    return undefined;
  }; // compute()

  methods.value = function () {
    return minimum;
  }; // value()

  methods.result = function () {
    var obj = Object.create( null );
    obj.min = minimum;
    return obj;
  }; // result()

  methods.reset = function () {
    minimum = Infinity;
  }; // reset()

  return methods;
}; // min()

module.exports = min;

},{}],21:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### slr (Simple Linear Regression)
/**
 *
 * Simple Linear Regression — **slr** is a higher order function that returns an
 * object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **correlation** between `x` and `y` values passed to it in real-time.
 * Probe the correlation anytime using `result()`, which may be reset via `reset()`.
 *
 * Number of decimals in the correlated values can be configured by defining
 * `fractionDigits` as parameter in `result()`. Its default value is **4**.
 * The `result()` also has an alias `value()`.
 *
 * The correlation is an object containing `slope`, `intercept`, `r`, `r2`, `se` along with
 * the `size` of data i.e. number of x & y pairs. *In case of any error such as no
 * input data or zero variance, correlation object will be an empty one*.
 *
 * @name streaming.slr
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var regression = slr();
 * regression.compute( 10, 80 );
 * regression.compute( 15, 75 );
 * regression.compute( 16, 65 );
 * regression.compute( 18, 50 );
 * regression.compute( 21, 45 );
 * regression.compute( 30, 30 );
 * regression.compute( 36, 18 );
 * regression.compute( 40, 9 );
 * regression.result();
 * // returns { slope: -2.3621,
 * //   intercept: 101.4188,
 * //   r: -0.9766,
 * //   r2: 0.9537,
 * //   se: 5.624,
 * //   size: 8
 * // }
 */
var slr = function () {
  var meanX = 0;
  var meanY = 0;
  var varX = 0;
  var varY = 0;
  var covXY = 0;
  var items = 0;
  // Returned!
  var methods = Object.create( null );

  methods.compute = function ( xi, yi ) {
    var dx, dy;
    items += 1;
    dx = xi - meanX;
    dy = yi - meanY;
    meanX += dx / items;
    meanY += dy / items;
    covXY += dx * ( yi - meanY );
    varX += dx * ( xi - meanX );
    varY += dy * ( yi - meanY );
    return undefined;
  }; // compute()

  methods.result = function ( fractionDigits ) {
    var model = Object.create( null );
    var fd = fractionDigits || 4;
    if ( ( items > 1 ) && ( varX !== 0 ) && ( varY !== 0 ) ) {
      model.slope = +( covXY / varX ).toFixed( fd );
      model.intercept = +( meanY - ( model.slope * meanX ) ).toFixed( fd );
      model.r = +( covXY / Math.sqrt( varX * varY ) ).toFixed( fd );
      model.r2 = +( model.r * model.r ).toFixed( fd );
      model.se = +( Math.sqrt( varY / ( items - 1 ) ) * Math.sqrt( 1 - model.r2 ) ).toFixed( fd );
      model.size = items;
    }
    return model;
  }; // result()

  methods.reset = function () {
    meanX = 0;
    meanY = 0;
    varX = 0;
    varY = 0;
    covXY = 0;
    items = 0;
  }; // reset()

  // There is no single correlation value; create an alias!
  methods.value = methods.result;

  return methods;
}; // slr()

module.exports = slr;

},{}],22:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### stdev
/**
 *
 * It is a higher order function that returns an object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **standard deviation** value of data items passed to it in real-time.
 * Probe the sample standard deviation anytime using `value()`, which may be reset via `reset()`.
 * The computations are inspired by the method proposed by [B. P. Welford](http://dx.doi.org/10.1080/00401706.1962.10490022).
 *
 * The `result()` returns an object containing sample `stdev` and
 * `variance`, along with `mean`, `size` of data; it also
 * contains population standard deviation and variance as `stdevp` and `variancep`.
 *
 * @name streaming.stdev
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var sd = stdev();
 * sd.compute( 2 );
 * sd.compute( 3 );
 * sd.compute( 5 );
 * sd.compute( 7 );
 * sd.value();
 * // returns 2.217355782608345
 * sd.result();
 * // returns { size: 4, mean: 4.25,
 * //   variance: 4.916666666666666,
 * //   stdev: 2.217355782608345,
 * //   variancep: 3.6874999999999996,
 * //   stdevp: 1.920286436967152
 * // }
 */
var stdev = function () {
  var mean = 0;
  var varianceXn = 0;
  var items = 0;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    var prevMean;
    items += 1;
    prevMean = mean;
    mean += ( di - mean ) / items;
    varianceXn += ( di - prevMean ) * ( di - mean );
    return undefined;
  }; // compute()

  // This returns the sample standard deviation.
  methods.value = function () {
    return ( items > 1 ) ? Math.sqrt( varianceXn / ( items - 1 ) ) : 0;
  }; // value()

  // This returns the sample standard deviation along with host of other statistics.
  methods.result = function () {
    var obj = Object.create( null );
    var variance = ( items > 1 ) ? ( varianceXn / ( items - 1 ) ) : 0;
    var variancep = ( items ) ? ( varianceXn / items ) : 0;

    obj.size = items;
    obj.mean = mean;
    // Sample variance & standard deviation.
    obj.variance = variance;
    obj.stdev = Math.sqrt( variance );
    // Population variance & standard deviation.
    obj.variancep = variancep;
    obj.stdevp = Math.sqrt( variancep );

    return obj;
  }; // result()

  methods.reset = function () {
    mean = 0;
    varianceXn = 0;
    items = 0;
  }; // reset()

  return methods;
}; // stdev()

module.exports = stdev;

},{}],23:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### sum
/**
 *
 * It is a higher order function that returns an object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **sum** of data items passed to it in real-time.
 * Probe the sum anytime using `value()`, which may be reset via `reset()`. The sum
 * is compensated for floating point errors using Neumaier Method.
 * The `result()` returns an object containing `sum`.
 *
 * @name streaming.sum
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var addition = sum();
 * addition.compute( 1 );
 * addition.compute( 10e+100 );
 * addition.compute( 1 );
 * addition.compute( -10e+100 );
 * addition.value();
 * // returns 2
 * addition.result();
 * // returns { sum: 2 }
 */
var sum = function () {
  var items = false;
  var total = 0;
  var compensation = 0;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
  var t;
  if ( items ) {
    t = total + di;
    compensation += ( Math.abs( total ) >= Math.abs( di ) ) ?
                    ( ( total - t ) + di ) :
                    ( ( di - t ) + total );
    total = t;
  } else {
    total = di;
    items = true;
  }
  return undefined;
  }; // compute()

  methods.value = function () {
   return ( total + compensation );
 }; // value()

  methods.result = function () {
   return { sum: total + compensation };
  }; // result()

  methods.reset = function () {
    items = false;
    total = 0;
    compensation = 0;
  }; // reset()

  return methods;
}; // sum()

module.exports = sum;

},{}],24:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

// ## streaming

// ### summary
/**
 *
 * It is a higher order function that returns an object containing `compute()`, `value()`, `result()`, and `reset()` functions.
 *
 * Use `compute()` to continuously determine the **summary statistics** of data items passed to it in real-time.
 * Probe the sample summary statistics anytime using `value()`, which may be reset via `reset()`. The
 * `result()` is also an alias of `value()`.
 * The computations are inspired by the method proposed by [B. P. Welford](http://dx.doi.org/10.1080/00401706.1962.10490022).
 *
 * The summary statistics is an object containing `size`, `min`, `mean`, `max`, sample `stdev` along with
 * sample `variance` of data; it also
 * contains population standard deviation and variance as `stdevp` and `variancep`.
 *
 * @name streaming.summary
 * @return {object} containing `compute`, `value`, `result`, and `reset` functions.
 * @example
 * var ss = summary();
 * ss.compute( 2 );
 * ss.compute( 3 );
 * ss.compute( 5 );
 * ss.compute( 7 );
 * ss.result();
 * // returns { size: 4, min: 2, mean: 4.25, max: 7,
 * //   variance: 4.916666666666666,
 * //   stdev: 2.217355782608345,
 * //   variancep: 3.6874999999999996,
 * //   stdevp: 1.920286436967152
 * // }
 */
var summary = function () {
  var mean = 0;
  var min = Infinity;
  var max = -Infinity;
  var varianceXn = 0;
  var items = 0;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    var prevMean;
    items += 1;
    prevMean = mean;
    mean += ( di - mean ) / items;
    min = ( min > di ) ? di : min;
    max = ( max < di ) ? di : max;
    varianceXn += ( di - prevMean ) * ( di - mean );
    return undefined;
  }; // compute()

  // This returns the sample's variance and standard deviation.
  methods.result = function () {
    var smmry = Object.create( null );
    var variance = ( items > 1 ) ? ( varianceXn / ( items - 1 ) ) : 0;
    var variancep = ( items ) ? ( varianceXn / items ) : 0;

    smmry.size = items;
    smmry.min = min;
    smmry.mean = mean;
    smmry.max = max;
    smmry.variance = variance;
    smmry.stdev = Math.sqrt( variance );
    smmry.variancep = variancep;
    smmry.stdevp = Math.sqrt( variancep );

    return smmry;
  }; // result()

  // There is no single summary value; create an alias!
  methods.value = methods.result;

  methods.reset = function () {
    mean = 0;
    min = Infinity;
    max = -Infinity;
    varianceXn = 0;
    items = 0;
  }; // reset()

  return methods;
}; // summary()

module.exports = summary;

},{}],25:[function(require,module,exports){
//     wink-statistics
//     Fast and Numerically Stable Statistical Analysis Utilities.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-statistics”.
//
//     “wink-statistics” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-statistics” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-statistics”.
//     If not, see <http://www.gnu.org/licenses/>.

var ws = Object.create( null );
// Probability name space.
ws.probability = Object.create( null );
// 1. range4CI
ws.probability.range4CI = require( './probability-range-4ci.js' );
// 2. aggregate
ws.probability.aggregate = require( './probability-aggregate.js' );

// Stats name space.
ws.stats = Object.create( null );
// 1. boxplot
ws.stats.boxplot = require( './stats-boxplot.js' );
// 2. fiveNumSummary
ws.stats.fiveNumSummary = require( './stats-five-num-summary.js' );
// 3. histogram
ws.stats.histogram = require( './stats-histogram.js' );
// 4. mad
ws.stats.mad = require( './stats-mad.js' );
// 5. max
ws.stats.max = require( './stats-max.js' );
// 6. mean
ws.stats.mean = require( './stats-mean.js' );
// 7. median
ws.stats.median = require( './stats-median.js' );
// 8. min
ws.stats.min = require( './stats-min.js' );
// 9. percentile
ws.stats.percentile = require( './stats-percentile.js' );
// 10. stdev
ws.stats.stdev = require( './stats-stdev.js' );

// Streaming name space.
ws.streaming = Object.create( null );
// 1. cov
ws.streaming.cov = require( './streaming-cov.js' );
// 2. freqTable
ws.streaming.freqTable = require( './streaming-freq-table.js' );
// 3. max
ws.streaming.max = require( './streaming-max.js' );
// 4. mean
ws.streaming.mean = require( './streaming-mean.js' );
// 5. min
ws.streaming.min = require( './streaming-min.js' );
// 6. slr
ws.streaming.slr = require( './streaming-slr.js' );
// 7. stdev
ws.streaming.stdev = require( './streaming-stdev.js' );
// 8. sum
ws.streaming.sum = require( './streaming-sum.js' );
// 9. summary
ws.streaming.summary = require( './streaming-summary.js' );
window.ws = ws;
module.exports = ws;

},{"./probability-aggregate.js":3,"./probability-range-4ci.js":4,"./stats-boxplot.js":5,"./stats-five-num-summary.js":6,"./stats-histogram.js":7,"./stats-mad.js":8,"./stats-max.js":9,"./stats-mean.js":10,"./stats-median.js":11,"./stats-min.js":12,"./stats-percentile.js":13,"./stats-stdev.js":14,"./streaming-cov.js":16,"./streaming-freq-table.js":17,"./streaming-max.js":18,"./streaming-mean.js":19,"./streaming-min.js":20,"./streaming-slr.js":21,"./streaming-stdev.js":22,"./streaming-sum.js":23,"./streaming-summary.js":24}]},{},[25]);
