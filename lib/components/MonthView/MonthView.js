import React, { Component } from 'react';
import { convert } from '../../util/';
import moment from 'moment';
import styled from 'styled-components';

const Dow = styled.td`
  text-align: center;
  font-weight: bold;
`;

class MonthView extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    this.state = {
      current: {
        year: today.getFullYear(),
        month: today.getMonth(),
      }
    }
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
        return event.start.getDate === (d + 1);
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
    console.log(rows);
    return rows;
  }

  lastMonth() {
    if (this.state.current.month === 0) {
      this.setState({current: { month: 11, year: this.state.current.year - 1 }});
    }
    else {
      this.setState({current: { month: this.state.current.month - 1,
        year: this.state.current.year }});
    }
  }

  nextMonth() {
    if (this.state.current.month === 11) {
      this.setState({current: { month: 0, year: this.state.current.year + 1 }});
    }
    else {
      this.setState({current: { month: this.state.current.month + 1,
        year: this.state.current.year }});
    }
  }

  render() {
    var curDate = this.state.current;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <td><button onClick={this.lastMonth} value="<< PREVIOUS MONTH" /></td>
              <td colspan="5">{moment(curDate.year.toString() +
                curDate.month.toString(),"YYYYMM").format("MMMM YYYYY")}
              </td>
              <td><button onClick={this.nextMonth} value="NEXT MONTH >>" /></td>
            </tr>
            <tr>
              {
                ["SUN","MON","TUE","WED","THU","FRI","SAT"].map(
                  (dow) => <td key={dow}>{dow}</td>
                )
              }
            </tr>
          </thead>
          <tbody>
            {this.outputRows(this.state.current.year, this.state.current.month, this.props.events)
              .map(function(week, i) {
              return (<tr key={i} className="week">
                {week.map(function(day) {
                  if (day !== null)
                    return (<td key={day[0]} className="day">
                      <div>
                        <p style={{ textAlign: "right" }}>{day[0].toString()}</p>
                        {(day[1].length) ? <ul>
                          {day[1].map(function(event, k) {
                            return <li key={k}><a href={event.link}>
                              {moment(event.start).format("HH:MM A") +
                                event.title}</a></li>
                          })}</ul> : ""}
                      </div>
                  </td>);
                  else
                    return <td className="day">{""}</td>;
                })}</tr>);
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = MonthView;
