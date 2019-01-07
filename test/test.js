import React from 'react';
import { render, configure, shallow } from 'enzyme';
import { expect } from 'chai';
import MonthView from '../lib/components/MonthView/MonthView.js';
import convert from '../lib/util/convert';
import keySwap from '../lib/util/keyswap';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Utility Functions', function() {
  it('key replacement', function(done) {
    var original = {
      "event": "LAN Party",
      "address": "123 Main St.",
      "why": "Just to have some fun!",
      "startDate": "January 29, 2018",
      "startTime": "10:00 PM",
      "endDate": "January 30, 2018",
      "endTime": "2:00 AM"
    },
    expected = {
      "title": "LAN Party",
      "location": "123 Main St.",
      "description": "Just to have some fun!",
      "start": new Date(2018, 0, 29, 22, 0),
      "end": new Date(2018, 0, 30, 2, 0),
    };
    expect(convert(original, [
      "startDate", "startTime", "endDate", "endTime"
    ])).to.deep.equal(expected);
    done();
  });
});

describe('MonthView Tests', function() {
  it('renders at least 4 weeks and 28 days', function(done) {
    const wrapper = shallow(<MonthView events={[]}/>);
    expect(wrapper.find('.week')).to.have.lengthOf.at.least(4);
    expect(wrapper.find('.day')).to.have.lengthOf.at.least(28);
    done();
  });
});

describe('Key Swap function tests', function() {
  it('works correctly', function() {
    const obj = { location: 'The Hub', time: '7:00 PM', event: "My Recital" },
      expected = { venue: 'The Hub', start: '7:00 PM', event: "My Recital"};
    expect(keySwap(obj, { location: 'venue', time: 'start'})).to.deep.equal(expected);
  });
});
