function draw ( data ) {

  // remove commons, wikidata and enwiki
  data = data.filter( function (d) {
    return ( d.wiki !== "English Wikipedia" && d.wiki !== 'Wikimedia Commons' && d.wiki !== 'Wikidata')
  })

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

  calculateRSq( 'monthly_unique_devices', 'mobile_unique_devices', data);

  var done = [];
  var relations = [];

  dimsToAnalyze.forEach( function (v1) {
    dimsToAnalyze.forEach( function (v2) {
      var name = v1 + ' and ' + v2;
      var name2 = v2 + ' and ' + v1;
      if ( v1 !== v2 && done.indexOf( name ) === -1 ) {
        var pcc = calculatePCC( v1, v2, data );
        var rsq = calculateRSq( v1, v2, data );
        done.push(name);
        done.push(name2)
        relations.push( {
          'name': name,
          'pcc': pcc,
          'b0': rsq.b0,
          'b1': rsq.b1
        });
      }
    } );
  });

  vegaEmbed( '#rel', {
    title: 'Relationship between variables',
    width: 900,
    height: 50,
    data: { values: relations },
    mark: 'point',
    encoding: {
      x: {
        field: 'pcc',
        type: 'quantitative'
      },
      tooltip: {
        field: 'name',
        type: 'nominal'
      }
    }
  });

  var toprel = relations.filter( function (r) {
    return r.pcc > 0.3;
  })

  toprel.sort( function (a,b) {
    return b.pcc - a.pcc;
  })

  var hr = true;

  toprel.forEach( function (rel) {
    vars = rel.name.split( " and " );
    v1 = vars[0];
    v2 = vars[1]
    console.log(v1,v2);

    data.forEach( function (row) {
      row[v2+'_predict'] = rel.b0 + ( rel.b1 * row[v1] );
    })

    if ( rel.pcc < 0.75 && hr ) {
      $( '#top' ).append(
        $('<hr>'),
        $('<h2>').text( 'Less correlated variables (PCC < 0.75)')
      )
      hr = false;
    }

    drawRegression( v1, v2, rel.pcc, data);
  })

};

function drawRegression(v1,v2, pcc, data) {
  var id = v1 + '-' + v2;
  pcc = '<big><code>'+ pcc.toFixed(2) + '</code></big>  ';
  var title = pcc + v1.split("_").join(" ").toUpperCase() +
    " and " +
    v2.split("_").join(" ").toUpperCase();
  var vizid = id + '-viz';
  var $div = $('<div>').attr('id', id );
  $('#top').append( $div );
  $div.append(
    $('<h3>').html( title ),
    $('<div>').attr( 'id', vizid )
  )


  vegaEmbed( '#' + vizid, {
    title: v1 + " and " + v2,
    width: 900,
    height: 400,
    data: { values: data },
    layer: [
      {mark: "point",
      "selection": {
        "grid": {
          "type": "interval", "bind": "scales"
        }
      },
      encoding: {
        x: {
          field: v1,
          type: 'quantitative'
        },
        y: {
          field: v2,
          type: 'quantitative'
        },
        tooltip: {
          field: 'wiki_name',
          type: 'nominal'
        }
      }},
      {
        mark: "line",
        encoding:{
          color: {"value": "red"},
        x: {
          field: v1,
          type: 'quantitative'
        },
        y: {
          field: v2+'_predict',
          type: 'quantitative'
        }}
      }
    ]
  })

}

function calculateRSq( v1, v2, data ) {
  var table = [];
  var xmean = window.ws.stats.mean( data, v1 );
  var ymean = window.ws.stats.mean( data, v2 );
  var prosum = window.ws.streaming.sum();
  var xsqsum = window.ws.streaming.sum();
  var ysqsum = window.ws.streaming.sum();
  data.forEach( function ( row ) {
    var obj = {};
    obj.x = row[v1];
    obj.y = row[v2];
    obj.minxmean = obj.x - xmean;
    obj.minymean = obj.y - ymean;
    obj.minxmeansq = obj.minxmean * obj.minxmean;
    obj.minymeansq = obj.minymean * obj.minymean;
    obj.pro = obj.minxmean * obj.minymean;

    prosum.compute( obj.pro );
    xsqsum.compute( obj.minxmeansq );
    ysqsum.compute( obj.minymeansq );
    table.push( obj );
  });

  var b1 = prosum.value() / xsqsum.value();
  var b0 = ymean - ( b1 * xmean);

  return {b1: b1, b0: b0};

  var ypredsum = window.ws.streaming.sum();
  var ydistancesum = window.ws.streaming.sum();

  data.forEach( function ( row ) {
    var ypredict = b0 + ( b1 * row[v1] );
    var ydistance = ( ypredict - ymean ) * ( ypredict - ymean );
    ypredsum.compute( ypredict );
    ydistancesum.compute( ydistance );
  } );

  return (ysqsum.value() / ydistancesum.value());
}

function calculatePCC(v1,v2,data) {
  var cov = calculateCov( v1, v2, data );
  var v1stdev = window.ws.stats.stdev( data, v1 );
  var v2stdev = window.ws.stats.stdev( data, v2 );
  var pcc = cov / ( v1stdev * v2stdev );
  return pcc;
}

function calculateCov(v1,v2,data) {
  var covariance = window.ws.streaming.cov();
  data.forEach(function (row) {
    covariance.compute(row[v1],row[v2]);
  })
  return covariance.value();
}
