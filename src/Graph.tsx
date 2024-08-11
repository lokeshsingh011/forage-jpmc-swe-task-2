import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;
  latestTimestamp: number | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem: PerspectiveViewerElement = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
    }
  }

  componentDidUpdate() {
    if (this.table) {
      // Filter out duplicated entries based on timestamp
      const uniqueData = this.props.data.filter((entry) => {
        // Only include new data or data with a timestamp greater than the latest timestamp
        if (!this.latestTimestamp || entry.timestamp > this.latestTimestamp) {
          this.latestTimestamp = Math.max(this.latestTimestamp || 0, entry.timestamp);
          return true;
        }
        return false;
      });

      // Format the data from ServerRespond to the schema
      const formattedData = uniqueData.map((el: any) => ({
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        top_bid_price: el.top_bid && el.top_bid.price || 0,
        timestamp: el.timestamp,
      }));

      this.table.update(formattedData);
    }
  }
}

export default Graph;
