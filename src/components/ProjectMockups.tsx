import { Icon } from './Icon';
import './ProjectMockups.css';

/*
 * Illustrative mockups built in HTML/CSS (no screenshots supplied yet).
 * Everything inside is sample data and hidden from assistive tech; the
 * wrapper in Work.tsx carries a descriptive label instead.
 */

// Deterministic pseudo-QR pattern — decorative only, encodes nothing.
const QR_SIZE = 21;
const qrCells = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const x = i % QR_SIZE;
  const y = Math.floor(i / QR_SIZE);
  const inFinder = (fx: number, fy: number) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7;
  if (inFinder(0, 0) || inFinder(14, 0) || inFinder(0, 14)) return false;
  return (x * 7 + y * 13 + x * y) % 5 < 2;
});

function FakeQr() {
  const finders = [
    [0, 0],
    [14, 0],
    [0, 14],
  ];
  return (
    <svg className="qr" viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} shapeRendering="crispEdges">
      {qrCells.map((on, i) =>
        on ? <rect key={i} x={i % QR_SIZE} y={Math.floor(i / QR_SIZE)} width="1" height="1" /> : null,
      )}
      {finders.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx} y={fy} width="7" height="7" />
          <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fff" />
          <rect x={fx + 2} y={fy + 2} width="3" height="3" />
        </g>
      ))}
    </svg>
  );
}

export function BookingMockup() {
  return (
    <div className="mock mock--booking" aria-hidden="true">
      <div className="mock-phone">
        <div className="mock-phone__notch" />
        <p className="mock-phone__kicker">Exclusives PH</p>
        <p className="mock-phone__title">Book your ticket</p>
        <div className="mock-ticket-type">
          <span>General admission</span>
          <span className="mock-qty">1</span>
        </div>
        <div className="mock-ticket-type">
          <span>Table reservation</span>
          <span className="mock-qty mock-qty--off">0</span>
        </div>
        <p className="mock-phone__label">Pay with</p>
        <div className="mock-pay">
          <span className="mock-pay__opt is-selected">GCash</span>
          <span className="mock-pay__opt">Maya</span>
        </div>
        <span className="mock-phone__btn">Pay &amp; get e-ticket</span>
      </div>

      <div className="mock-scanner">
        <div className="mock-scanner__bar">
          <span className="mock-dot" />
          <span>Door check-in</span>
          <span className="mock-live">LIVE</span>
        </div>
        <div className="mock-scanner__body">
          <div className="mock-scanner__frame">
            <FakeQr />
            <span className="mock-scanner__beam" />
          </div>
          <div className="mock-scanner__result">
            <Icon name="check" size={16} />
            <span>Ticket valid · checked in</span>
          </div>
          <div className="mock-scanner__rows">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

const sheetRows = [
  ['3 slim gallons', '14 Rizal St.', 'New'],
  ['2 round gallons', 'Sample address', 'Out'],
  ['5 slim gallons', 'Sample address', 'Done'],
];

export function BotMockup() {
  return (
    <div className="mock mock--bot" aria-hidden="true">
      <div className="mock-chat">
        <div className="mock-chat__head">
          <span className="mock-avatar">RS</span>
          <span>Messenger</span>
        </div>
        <p className="mock-bubble mock-bubble--in">Open po kayo ngayon?</p>
        <p className="mock-bubble mock-bubble--out">Yes po! Open until [HOURS]. Want to order?</p>
        <p className="mock-bubble mock-bubble--in">3 slim gallons po, 14 Rizal St.</p>
        <p className="mock-bubble mock-bubble--out">Order saved. Salamat po!</p>
      </div>

      <div className="mock-sheet">
        <div className="mock-sheet__bar">
          <Icon name="sheet" size={14} />
          <span>Orders</span>
        </div>
        <table className="mock-sheet__table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sheetRows.map((row, i) => (
              <tr key={i} className={i === 0 ? 'is-new' : undefined}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>
                  <span className={`mock-status mock-status--${row[2].toLowerCase()}`}>{row[2]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mock-telegram">
        <Icon name="send" size={14} />
        <span>New order · 3 slim gallons</span>
      </div>
    </div>
  );
}
