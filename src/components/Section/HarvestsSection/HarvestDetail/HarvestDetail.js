import React, { Component } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import { fetchCatalog, fetchHarvest } from '../../../../fetch/fetch';
import { waitForDataAndSetState, cancelAllPromises } from '../../../../helpers/components'
import { theme } from '../../../../tools';

class HarvestDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {errors: []}
  }

  componentWillMount() {
    return Promise.all([
      this.updateCatalog(),
      this.updateHarvest(),
    ])
  }

  updateHarvest() {
    return waitForDataAndSetState(
      fetchHarvest(this.props.params.catalogId, this.props.params.harvestId),
      this,
      'harvest'
    );
  }

  updateCatalog() {
    return waitForDataAndSetState(
      fetchCatalog(this.props.params.catalogId),
      this,
      'catalog'
    );
  }

  componentWillUnmount() {
    return cancelAllPromises(this)
  }

  render() {
    if (this.state.harvest && this.state.catalog) {
      const date = new Date(this.state.harvest.finished).getTime()
      const hoursDifference = moment(date).fromNow();
      const success = this.state.harvest.status === 'successful'
      const styles = {
        paper: {
          padding: '3em',
        },
        header: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap-reverse',
        },
        h1: {
          padding: '0.1em',
        },
        chip: {
          margin: '2em',
        },
        content: {
          padding: '2em',
        },
        li: {
          margin: '1em',
        },
        log: {
          padding: '1em',
          backgroundColor: theme.darkblue,
        },
        results: {
          marginLeft: '0.5em',
          fontSize: '1.5em',
        },
      };

      const content = (success) => {
        if (success) {
          return <ul>
                  {this.state.harvest.log.map((log, idx) =>
                    <li key={idx} style={styles.li}>
                      {log.split(':')[0]}: <span style={styles.results}>{log.split(':')[1]}
                    </span></li>)}
                </ul>
        }
        return <div style={styles.log}>
                  {this.state.harvest.log.map((log, idx) => <pre key={idx}><code>{log}</code></pre>)}
                </div>
      }

      styles.chip.color = success ? theme.green : theme.red

      return (
        <div style={styles.paper} className="harvest-detail">

          <div style={styles.header} >
            <div>
              <Link to={`/catalogs/${this.props.params.catalogId}`}>
                <h1 style={styles.h1} className="ui header">{this.state.catalog.name}</h1>
              </Link>
              <h2>Harvest ID: {this.state.harvest._id}</h2>
            </div>

            <span style={styles.chip}>
              {this.state.harvest.status} {hoursDifference}
            </span>
          </div>

          <div style={styles.content}>
            <div className="ui header">{success ? 'Results' : 'Logs'}</div>
            <div className="ui divider"></div>
            {content(success)}
          </div>

        </div>
    )} else {
      return <div></div>
    }
  }
}

export default HarvestDetail
