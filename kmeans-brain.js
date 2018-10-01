function draw ( data ) {

  // remove commons, wikidata and enwiki
  data = data.filter( function (d) {
    return ( d.wiki !== "English Wikipedia" && d.wiki !== 'Wikimedia Commons' && d.wiki !== 'Wikidata')
  });

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

  var arrayData = data.map( function (row , index) {
    var rowArray = [ index ];

    dimsToAnalyze.forEach( function (dim) {
      rowArray.push( row[dim] );
    })

    return rowArray;
  })

  showClusters('Three Clusters',window.cluster.kmeans(arrayData,3),data);
  showClusters('Four Clusters',window.cluster.kmeans(arrayData,4),data);
  showClusters('Five',window.cluster.kmeans(arrayData,5),data);
  showClusters('Six Clusters',window.cluster.kmeans(arrayData,6),data);
  showClusters('Seven',window.cluster.kmeans(arrayData,7),data);
};


function showClusters(title,clusters, data) {
  var id = title.split(" ").join("-").toLowerCase();
  var vizid = id + '-viz';
  var $div = $('<div>').attr('id',id);
  var $vizdiv = $('<div>').attr('id',vizid)
  var $title = $('<h1>').text(title);
  $div.append( $title, $vizdiv);
  $('#kmeans').append($div);



  clusters.forEach( function (cluster, index ) {
    var $ul = $('<ul>')
    $ul.append( $('<li>').html('<h3>Cluster '+ (parseInt(index)+1)+' ( '+cluster.length+' wikis)</h3>'));
    cluster.forEach( function (wikirow) {
      var wiki = data[ wikirow[0]].wiki;
      data[wikirow[0]].cluster = 'Cluster '+ (parseInt(index)+1);
      $ul.append( $('<li>').text(wiki));
    })
    $div.append($ul);
  });
  $div.append('<div style="clear:both"></div><hr>');

  vegaEmbed("#" + vizid,{
    title: "Comparison across Monthly Unique Devices, Content Pages, and Monthly Editors",
    width: 900,
    height: 900,
    "repeat": {
      "row": ["monthly_unique_devices", "content_pages", "monthly_editors"],
      "column": ["monthly_editors", "content_pages", "monthly_unique_devices"]
    },
    "spec": {
      data: { values: data },
      "mark": "point",
      "selection": {
        "brush": {
          "type": "interval",
          "resolve": "union",
          "on": "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
          "translate": "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
          "zoom": "wheel![event.shiftKey]"
        },
        "grid": {
          "type": "interval",
          "resolve": "global",
          "bind": "scales",
          "translate": "[mousedown[!event.shiftKey], window:mouseup] > window:mousemove!",
          "zoom": "wheel![!event.shiftKey]"
        }
      },
      "encoding": {
        "x": {"field": {"repeat": "column"},"type": "quantitative"},
        "y": {"field": {"repeat": "row"},"type": "quantitative"},
        color: {
          field: 'cluster',
          type: 'nominal'
        }
      }
    }
  });
}
