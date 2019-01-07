import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import convert from '../../util/convert/convert';

function dateMatch(stateObj, day) {
  var today = new Date();
  return today.getFullYear() === stateObj.year &&
    today.getMonth() ===  stateObj.month &&
    day === today.getDate();
}

const Dow = styled.td`
  vertical-align: top;
  text-align: center;
  font-weight: bold;
  width: calc(100% / 7);
  height: 25px;
`, VanishingSpan = styled.span`
  @media (max-width: 800px) {
    display: none;
  }
`,
  Frame = styled.div`
  width: 100%;
  height: 350px;
`, Day = styled.td`
  vertical-align: top;
  width: calc(100% / 7);
  padding: 10px;
  height: 60px;
  border: thin black solid;
`, HoverLink = styled.a`
  @media (max-width: 800px) {
    font-size: .625em;
  }
  &:hover:after {
    content: attr(title);
    background-color: grey;
    padding: 2px 5px;
    color: white;
    position: absolute;
  }
`;

class MonthView extends Component {
  static propTypes = {
    events: PropTypes.array
  }

  constructor(props) {
    super(props);
    var today = new Date();
    if (props.events.length <= 0) {
      this.state = {
        current: {
          year: today.getFullYear(),
          month: today.getMonth(),
        }
      }
    }
    else {
      var nextEvent = props.events.filter(function(event) {
        return +event.start > new Date();
      })[0];
      this.state = {
        current: {
          year: nextEvent ? nextEvent.start.getFullYear() : today.getFullYear(),
          month: nextEvent ? nextEvent.start.getMonth() : today.getMonth(),
        }
      };
    }

    this.outputRows = this.outputRows.bind(this);
    this.lastMonth = this.lastMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }

  outputRows(year, month, events) {
    var filteredEvents = events.filter(function(event) {
        return event.start.getFullYear() === year &&
        event.start.getMonth() === month;
      }),
      filteredEventArray = {};
    var dpm = [
        31,
        year % 4 === 0 && year % 100 !== 0 ? 29 : 28,
        31, 30, 31, 30, 31, 31, 30, 31, 30, 31
      ],
      dow = new Date(year, month, 1).getDay(), rows = [];
    rows.push([]);
    for (var g = 0; g < dow; g++) {
      rows[0].push(null);
    }
    for (var d = 0; d < dpm[month]; d++) {
      if (dow === 0 && rows.length > 0) rows.push([]);
      rows.slice(-1)[0][dow] = [(d + 1), filteredEvents.filter(function(event) {
        return event.start.getDate() === (d + 1);
      })];
      dow = (dow + 1) % 7;
    }
    for (var m = dow; m < 7; m++) {
      rows.slice(-1)[0][m] = null;
    }
    if (dow === 0 && rows.length === 4) {
      rows.push([null, null, null, null, null, null, null]);
      rows.push([null, null, null, null, null, null, null]);
    }
    return rows;
  }

  lastMonth() {
    if (this.state.current.month === 0) {
      this.setState({
        current: { month: 11, year: this.state.current.year - 1 }
      });
    }
    else {
      this.setState({
        current: {
          month: this.state.current.month - 1,
          year: this.state.current.year }
      });
    }
  }

  nextMonth() {
    if (this.state.current.month === 11) {
      this.setState({
        current: { month: 0, year: this.state.current.year + 1 } });
    }
    else {
      this.setState({ current: { month: this.state.current.month + 1,
        year: this.state.current.year } });
    }
  }

  render() {
    var curDate = this.state.current;
    return (
      <Frame>
        <table style={{ minWidth: '100%', maxWidth: '100%' }}>
          <thead>
            <tr style={{ height: '50px' }}>
              <td>
                <button style={{ width: '100%' }}
                  onClick={this.lastMonth}>
                  &lt;&lt; <VanishingSpan>PREVIOUS MONTH</VanishingSpan>
                </button>
              </td>
              <td style={{ 'textAlign': 'center' }}
                className="month__name" colSpan='5'>
                {moment(curDate.year.toString() +
                (curDate.month + 1).toString(),'YYYYMM').format('MMMM YYYY')}
              </td>
              <td>
                <button button style={{ width: '100%' }}
                  onClick={this.nextMonth}>
                  &gt;&gt; <VanishingSpan>NEXT MONTH</VanishingSpan>
                </button>
              </td>
            </tr>
            <tr>
              {
                ['SUN','MON','TUE','WED','THU','FRI','SAT'].map(
                  (dow) => <Dow key={dow}>{dow}</Dow>
                )
              }
            </tr>
          </thead>
          <tbody>
            {this.outputRows(this.state.current.year,
              this.state.current.month, this.props.events)
              .map(function(week, i) {
                return (<tr key={'week-' + i} className='week'>
                  {week.map(function(day) {
                    if (day !== null)
                      return (<Day key={'day-' + day[0]} className='day'>
                        <div>
                          <p style={{
                            textAlign: 'right', margin: 0,
                            backgroundColor: dateMatch(curDate, day[0]) ?
                              'black' : 'white',
                            color: dateMatch(curDate, day[0]) ?
                              'white' : 'black',
                          }}>
                            {day[0].toString()}
                          </p>
                          {(day[1].length) ? <ul style={{ 'paddingLeft': 0 }}>
                            {day[1].map(function(event, k) {
                              return <li
                                style={{ listStyle: 'none' }}
                                key={'event-' + k}>
                                <HoverLink href={event.link}
                                  title={event.title + ' @ ' + event.location}>
                                  {moment(event.start)
                                    .format(event.start.getMinutes() ?
                                      'h:mm A' : 'h A')}
                                </HoverLink></li>
                            })}</ul> : ''}
                        </div>
                      </Day>);
                    else
                      return <Day className='day'>{''}</Day>;
                  })}</tr>);
              })}
          </tbody>
        </table>
      </Frame>
    );
  }
}

export default MonthView;
