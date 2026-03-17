import { isOpenNow } from './isOpenNow.js';

const mockHours = {
  mon: { open: '05:00', close: '13:00' },
  tue: { open: '05:00', close: '13:00' },
  wed: { open: '05:00', close: '13:00' },
  thu: { open: '05:00', close: '13:00' },
  fri: { open: '05:00', close: '13:00' },
  sat: { open: '05:00', close: '14:00' },
  sun: null,  // closed on Sunday
};

// test with mock time
function testAt(isoString, expected, label) {
  // monkey-patch Date to mock time
  const OrigDate = Date;
  global.Date = class extends OrigDate {
    constructor(...args) {
      if (args.length === 0) return new OrigDate(isoString);
      super(...args);
    }
  };

  const result = isOpenNow(mockHours);
  const pass = result === expected;
  console.log(`${pass ? 'success' : 'fail'} ${label}: expected ${expected}, got ${result}`);

  global.Date = OrigDate;
}

// Monday 09:00 Thai → open
testAt('2025-06-02T02:00:00Z', true,  'Monday 09:00 should be open');

// Monday 14:00 Thai → closed
testAt('2025-06-02T07:00:00Z', false, 'Monday 14:00 should be closed');

// Sunday 09:00 Thai → closed all day
testAt('2025-06-01T02:00:00Z', false, 'Sunday should be closed all day');

// Saturday 13:30 Thai → open (close at 14:00)
testAt('2025-05-31T06:30:00Z', true,  'Saturday 13:30 should be open');