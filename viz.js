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

  var editor_cluster = {
    title: "Editor cluster",
    width: 800,
    height: 400,
    data: { values: data },
    "selection": {
      "grid": {
        "type": "interval", "bind": "scales"
      }
    },
    mark: 'point',
    encoding: {
      x: {
        field: 'monthly_new_active_editors',
        type: 'quantitative'
      },
      y: {
        field: 'monthly_active_editors',
        type: 'quantitative'
      },
      size: {
        field: 'monthly_editors',
        type: 'quantitative'
      },
      tooltip: {
        field: 'wiki_name',
        type: 'nominal'
      }
    }
  }
  vegaEmbed("#editor_cluster", editor_cluster);

  vegaEmbed("#largest-wiki-smallest-editor", {
    title: "Largest Wiki & Smallest Editors",
    width: 800,
    height: 400,
    data: { values: data },
    "selection": {
      "grid": {
        "type": "interval", "bind": "scales"
      }
    },
    mark: 'point',
    encoding: {
      x: {
        field: 'unique_devices_per_editor',
        type: 'quantitative'
      },
      y: {
        field: 'overall_size_rank',
        type: 'quantitative'
      },
      color: {
        field: 'project_name',
        type: 'nominal'
      },
      tooltip: {
        field: 'wiki_name',
        type: 'nominal'
      }
    }
  } );
}
