import Reveal from './Reveal';
import Scramble from './Scramble';

interface Props {
  num: string;
  label: string;
  title: React.ReactNode;
  lede?: string;
}

export default function SectionHeader({ num, label, title, lede }: Props) {
  return (
    <div className="sec-head">
      <Reveal>
        <div className="sec-head__num">
          <span>
            {num} / <Scramble text={label} />
          </span>
        </div>
        <h2 className="sec-head__title">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={120}>
          <p className="sec-head__lede">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
