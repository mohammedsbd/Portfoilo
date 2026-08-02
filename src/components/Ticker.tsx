import { tickerItems } from '@/data/facts';

export default function Ticker() {
  // Two identical tracks so the loop has no visible seam.
  const track = (key: string) => (
    <div className="ticker__track" key={key} aria-hidden={key === 'b'}>
      {tickerItems.map((item) => (
        <span className="ticker__item" key={item}>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker">
      {track('a')}
      {track('b')}
    </div>
  );
}
