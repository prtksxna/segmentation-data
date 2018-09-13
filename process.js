function draw ( data ) {

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

  dimsToAnalyze.forEach( function ( dim ) {
    analyzeDimension( data, dim )
  })
}

function analyzeDimension( data, dim ) {
  var summary = summaryForDimension( data, dim );
  data = data.slice();

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

  $el.append($('<p>').append ( getDimSumSen( summary ) ));
  drawScatter( 'For all data', dim, data, $el );

  if ( data.length > main.length ) {
    var mainSummary = summaryForDimension( main, dim )
    $el.append($('<p>').append ( getDimSumSen( mainSummary )));
    drawScatter( 'For main', dim, main, $el );
  }
  if ( top.length > 0 ) {
    var topSummary = summaryForDimension( top, dim )
    $el.append($('<p>').append ( getDimSumSen( topSummary )));
    drawScatter( 'For top outlier', dim, top, $el );
  }
  if ( bottom.length > 0 ) {
    var bottomSummary = summaryForDimension( bottom, dim )
    $el.append($('<p>').append ( getDimSumSen( bottomSummary )));
    drawScatter( 'For bottom outlier', dim, bottom, $el );
  }

}

function drawScatter(title, dim, data,$el) {
  var id = 'viz-' + dim + '-' + title.toLowerCase().split( ' ' ).join( '-' );
  $el.append( $('<div>').attr('id',id))
  vegaEmbed( '#' + id, {
    title: title + ' (' + data.length + ')',
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
