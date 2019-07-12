import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import convert from '../../util/convert';
import keySwap from '../../util/keyswap';

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

function MonthView({ events, swapOptions }) {
  let today = new Date(), [state, setState] = useState({ current: {
    year: today.getFullYear(),
    month: today.getMonth()
  }});

  useEffect(function() {
    if (events.length) {
      var nextEvent = events.filter(function(event) {
        return +event.start > new Date();
      })[0];
      setState({
        current: {
          year: nextEvent ? nextEvent.start.getFullYear() : today.getFullYear(),
          month: nextEvent ? nextEvent.start.getMonth() : today.getMonth(),
        }
      });
    }
  });

  function outputRows(year, month, events) {
    var filteredEvents = events.filter(function(event) {
        return event.start.getFullYear() === year &&
        event.start.getMonth() === month;
      }).map(event => swapOptions ? keySwap(event, swapOptions) : convert(event)),
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

  function lastMonth() {
    if (state.current.month === 0) {
      setState({
        current: { month: 11, year: state.current.year - 1 }
      });
    }
    else {
      setState({
        current: {
          month: state.current.month - 1,
          year: state.current.year }
      });
    }
  }

  function nextMonth() {
    if (state.current.month === 11) {
      setState({
        current: { month: 0, year: state.current.year + 1 } });
    }
    else {
      setState({ current: { month: state.current.month + 1,
        year: state.current.year } });
    }
  }
    var { current } = state;

    return <Frame>
        <table style={{ minWidth: '100%', maxWidth: '100%' }}>
          <thead>
            <tr style={{ height: '50px' }}>
              <td>
                <button style={{ width: '100%' }} onClick={lastMonth}>
                  &lt;&lt; <VanishingSpan>PREVIOUS MONTH</VanishingSpan>
                </button>
              </td>
              <td style={{ 'textAlign': 'center' }}
                className="month__name" colSpan='5'>
                {moment(current.year.toString() +
                (current.month + 1).toString(),'YYYYMM').format('MMMM YYYY')}
              </td>
              <td>
                <button button style={{ width: '100%' }}
                  onClick={nextMonth}>
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
            {outputRows(current.year, current.month, events)
              .map(function(week, i) {
                return (<tr key={'week-' + i} className='week'>
                  {week.map(function(day) {
                    if (day !== null)
                      return (<Day key={'day-' + day[0]} className='day'>
                        <div>
                          <p style={{
                            textAlign: 'right', margin: 0,
                            backgroundColor: dateMatch(current, day[0]) ?
                              'black' : 'white',
                            color: dateMatch(current, day[0]) ?
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
                    else return <Day className='day'>{''}</Day>;
                  })}</tr>);
              })}
          </tbody>
        </table>
      </Frame>;
}

MonthView.propTypes = {
  events: PropTypes.array,
  swapOptions: PropTypes.object
};

export default MonthView;
