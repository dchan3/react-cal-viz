const EventSchema = {
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  link: {
    type: String,
    required: false
  }
};

const aliases = {
  "name": "title",
  "event": "title",
  "what": "title",
  "notes": "description",
  "comments": "description",
  "why": "description",
  "address": "location",
  "where": "location",
  "from": "start",
  "until": "end",
  "til": "end",
  "till": "end",
  "to": "end",
  "url": "link"
};

module.exports = {
  EventSchema: EventSchema,
  EventSchemaAliases: aliases
};
