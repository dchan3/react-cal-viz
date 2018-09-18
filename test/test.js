import React from 'react';
import { render, configure, shallow } from 'enzyme';
import { expect } from 'chai';
import { convert } from '../lib/util';
import { MonthView } from '../lib/components';
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
  it('renders 6 weeks and 42 days', function(done) {
    const wrapper = shallow(<MonthView events={[]}/>);
    expect(wrapper.find('.week')).to.have.lengthOf(6);
    expect(wrapper.find('.day')).to.have.lengthOf(42);
    done();
  });
});
