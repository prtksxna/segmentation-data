nth= function(x){
    if(x%1) return this;
    var s= x%100;
    if(s>3 && s<21) return x+'th';
    switch(s%10){
        case 1: return x+'st';
        case 2: return x+'nd';
        case 3: return x+'rd';
        default: return x+'th';
    }
}

function draw ( data ) {

  // remove commons, wikidata and enwiki
  /*data = data.filter( function (d) {
    return ( d.wiki !== "English Wikipedia" && d.wiki !== 'Wikimedia Commons' && d.wiki !== 'Wikidata')
  })*/

  var dimsToAnalyze = [
    'monthly_unique_devices',
    'mobile_unique_devices',
    'mobile_web_pageviews',
    'mobile_app_pageviews',
    'unique_devices_per_editor',
    'monthly_editors',
    'monthly_new_active_editors',
    'monthly_active_editors',
    'monthly_active_administrators',
    'second_month_new_editor_retention',
    'majority_mobile_editors',
    'monthly_nonbot_edits',
    'bot_edits',
    'mobile_edits',
    'visual_edits',
    'anonymous_edits',
    'revert_rate',
    'edits_gini_coefficient',
    'content_pages',
    'cumulative_content_edits',
    'edits_per_content_page',
  ];

  var cv = [];

  dimsToAnalyze.forEach( function ( dim ) {
    var a = analyzeDimension( data, dim );
    cv.push( {
      dim: dim,
      cv: a.cv,
      range: a.range,
      main_cv: a.main_cv,
      main_range: a.main_range
    } );
  })

  vegaEmbed( '#cv', {
    title: "Coefficient of Variance",
    width: 900,
    height: 300,
    data: { values: cv },
    mark: "bar",
    encoding: {
      x: {
        field: "dim",
        type: "ordinal",
        sort: {
          field: "cv",
          op: "average",
          order: "descending"
        }
      },
      y: {
        field: "cv",
        type: "quantitative"
      }
    }
  })

  vegaEmbed( '#range', {
    title: "Range of variable",
    width: 900,
    height: 100,
    data: { values: cv },
    mark: "bar",
    encoding: {
      x: {
        field: "dim",
        type: "ordinal",
        sort: {
          field: "cv",
          op: "average",
          order: "descending"
        }
      },
      y: {
        field: "range",
        type: "quantitative"
      }
    }
  })

  vegaEmbed( '#main_cv', {
    title: "Coefficient of Variance",
    width: 900,
    height: 300,
    data: { values: cv },
    mark: "bar",
    encoding: {
      x: {
        field: "dim",
        type: "ordinal",
        sort: {
          field: "cv",
          op: "average",
          order: "descending"
        }
      },
      y: {
        field: "main_cv",
        type: "quantitative"
      }
    }
  })

  vegaEmbed( '#main_range', {
    title: "Range of variable",
    width: 900,
    height: 100,
    data: { values: cv },
    mark: "bar",
    encoding: {
      x: {
        field: "dim",
        type: "ordinal",
        sort: {
          field: "cv",
          op: "average",
          order: "descending"
        }
      },
      y: {
        field: "main_range",
        type: "quantitative"
      }
    }
  })
}

function analyzeDimension( data, dim ) {
  var summary = summaryForDimension( data, dim );
  data = data.slice();
  var the_cv, the_range, the_main_cv, the_main_range;

  var top = data.filter( function ( d ) {
    return ( d[dim] > ( summary.q3 + ( summary.iqr * 1.5 ) ) );
  });

  var bottom = data.filter( function ( d ) {
    return ( d[dim] < ( summary.q1 - ( summary.iqr * 1.5 ) ) );
  });

  var main = data.filter( function ( d ) {
    return (
      ( d[dim] < ( summary.q3 + ( summary.iqr * 1.5 ) ) ) &&
      ( d[dim] > ( summary.q1 - ( summary.iqr * 1.5 ) ) )
    );
  });

  var $el = $('<div>')
    .attr( 'id', dim + '-container')
    .append( $('<h3>').text(dim))
  $('#vars').append($el)

  the_cv = (summary.stdev / summary.mean) * 100;
  the_range = nOfUniqPointsInDim(data, dim);
  the_main_cv = (summary.stdev / summary.mean) * 100;
  the_main_range = nOfUniqPointsInDim(data, dim);
  $el.append($('<p>').append ( getDimSumSen( summary ) ));
  drawScatter( 'For all data', dim, data, $el );

  if ( data.length > main.length ) {
    var mainSummary = summaryForDimension( main, dim )
    the_main_cv = (mainSummary.stdev / mainSummary.mean) * 100;
    the_main_range = nOfUniqPointsInDim(main, dim);
    $el.append($('<p>').append ( getDimSumSen( mainSummary )));

    var percentile = nth(Math.round((main.length*100)/ data.length));
    var title = 'For data below the ' + percentile + ' percentile';

    drawScatter( title, dim, main, $el );
  }
  if ( top.length > 0 ) {
    var topSummary = summaryForDimension( top, dim )
    $el.append($('<p>').append ( getDimSumSen( topSummary )));

    var percentile = nth(Math.round(((data.length-top.length)*100)/ data.length));
    var title = 'For data above the ' + percentile + ' percentile';

    drawScatter( title, dim, top, $el );
  }
  if ( bottom.length > 0 ) {
    var bottomSummary = summaryForDimension( bottom, dim )
    $el.append($('<p>').append ( getDimSumSen( bottomSummary )));
    drawScatter( 'For bottom outlier', dim, bottom, $el );
  }

  return {
    cv: the_cv,
    range: the_range,
    main_cv: the_main_cv,
    main_range: the_main_range
  }
}

function drawScatter(title, dim, data,$el) {
  var id = 'viz-' + dim + '-' + title.toLowerCase().split( ' ' ).join( '-' );
  $el.append( $('<div>').attr('id',id))
  vegaEmbed( '#' + id, {
    title: title + ' (' + data.length + ' wikis)',
    width: 900,
    height: 50,
    data: { values: data },
    "selection": {
      "grid": {
        "type": "single",
      }
    },
    layer: [
      {
        mark: 'point',
        encoding: {
          x: {
            field: dim,
            type: 'quantitative'
          },
          tooltip: {
            field: 'wiki_name',
            type: 'nominal'
          }
        }
      },
      {
        "mark": {"type": "rule", "color": "red"},
        "encoding": {
          "x": {
            "aggregate": "average",
            "field": dim,
            "type": "quantitative"
          }
        }
      }
    ]
  });
}

function getDimSumSen( summary ) {
  var cv = Math.round((summary.stdev / summary.mean) * 100);
  return 'Below we look at <code>' + summary.size + '</code> data points, the smallest value was <code>' + summary.min + '</code>, and the largest <code>' + summary.max +'</code>. The coefficient of variance was <strong><code>' + cv + '%</code></strong>.';
}

function nOfUniqPointsInDim( data, dim) {
  var array = data.map( function ( d ) {
    return d[dim];
  });

  return unique( array ).length;
}

function unique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

function summaryForDimension( data, dim ) {
  var array = data.map( function ( d ) {
    return d[dim];
  })

  array.sort(function(a, b) {
    return a - b;
  });

  var summary = window.ws.stats.fiveNumSummary( array );
  summary.mean = window.ws.stats.mean( array );
  summary.stdev = window.ws.stats.stdev( array );
  return summary;
}
