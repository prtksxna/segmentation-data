d3.csv('data.csv', function ( d ) {
  console.log( d );
  return {
    wiki: d.wiki,
    overall_size_rank: rc(d['overall size rank']),
    monthly_unique_devices: rc( d['monthly unique devices'] ),
    mobile_unique_devices: rp( d['mobile unique devices'] ),
    mobile_web_pageviews: rp( d['mobile web pageviews']),
    mobile_app_pageviews: rp( d['mobile app pageviews']),
    unique_devices_per_editor: rp( d['unique devices per editor']),
    monthly_editors: rc( d['monthly editors']),
    monthly_new_active_editors: rc(d['monthly new active editors']),
    monthly_active_editors: rc( d['monthly active editors']),
    monthly_active_administrators: rc( d['monthly active administrators']),
    second_month_new_editor_retention: rp(d['second-month new editor retention']),
    majority_mobile_editors: rp( d['majority-mobile editors']),
    monthly_nonbot_edits: rc(d['monthly nonbot edits']),
    bot_edits: rp(d['bot edits']),
    mobile_edits: rp(d['mobile edits']),
    visual_edits: rp(d['visual edits']),
    anonymous_edits: rp(d['anonymous edits']),
    revert_rate: rp(d['revert rate']),
    edits_gini_coefficient: rc(d['edits Gini coefficient']),
    monthly_flow_messages: rc(d['monthly flow messages']), // TODO This is different in the downloaded data
    content_pages: rc(d['content pages']),
    cumulative_content_edits: rc(d['cumulative content edits']),
    edits_per_content_page: rc(d['edits per content page']),
    script_direction: d['script direction'],
    database_code: d['database code'],
    project_code: d['project code'],
    language_code: d['language code'],
    domain_name: d['domain name'],
    language_name: d['language name'],
    project_name: d['project name'],
    wiki_name: d['wiki name']
  }
}).then( function (data) {
  draw( data );
});

function draw(data) {
  var top_mobile = {
    title: "Mobile Web Pageviews > 65%",
    data: { values: data },
    transform: [
      {
        filter: {
          field: "mobile_web_pageviews",
          gte: 65
        }
      }
    ],
    mark: "bar",
    encoding: {
      x: {
        field: "wiki",
        type: "ordinal",
        sort: {
          field: "mobile_web_pageviews",
          op: "average",
          order: "descending"
        }
      },
      y: {
        field: "mobile_web_pageviews",
        type: "quantitative"
      }
    }
  }
  vegaEmbed("#top_mobile", top_mobile);
}

// Remove commas
function rc(v) {
  return parseFloat( v.replace(/\,/g,'') );
}

// Remove percentage
function rp(v) {
  return parseFloat( v.replace(/\%/g,'') );
}
