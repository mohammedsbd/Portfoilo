export const stackGroups = ['Languages', 'Frameworks', 'Runtime & tools'] as const;

export type StackGroup = (typeof stackGroups)[number];

export interface StackEntry {
  /** Two-letter mark, set like an element symbol. */
  symbol: string;
  name: string;
  group: StackGroup;
  /** The true thing — what I actually do with it. */
  line: string;
  /** Only set where something real was shipped with it. */
  shipped?: string;
}

/**
 * The stack, set as a table of elements.
 *
 * Every line here is something I can point at. Where a tile names a project,
 * that project exists and I built it; where it doesn't, the tool is in the kit
 * without a shipped product behind it yet, and the line says so rather than
 * inventing one.
 */
export const stack: StackEntry[] = [
  {
    symbol: 'Ts',
    name: 'TypeScript',
    group: 'Languages',
    line: 'The default. Anything I start now is typed end to end, including the page you are reading.',
    shipped: 'This site',
  },
  {
    symbol: 'Js',
    name: 'JavaScript',
    group: 'Languages',
    line: 'Where it started. Six months of it at Evangadi Tech before TypeScript made me stop guessing.',
  },
  {
    symbol: 'Rb',
    name: 'Ruby',
    group: 'Languages',
    line: 'The one I write for the pleasure of it. Reads closer to a sentence than anything else on this table.',
  },
  {
    symbol: 'Ph',
    name: 'PHP',
    group: 'Languages',
    line: 'Underrated and everywhere. Four months of it behind an API real people filed feedback through.',
    shipped: 'LaloDev feedback platform',
  },
  {
    symbol: 'Py',
    name: 'Python',
    group: 'Languages',
    line: 'Kept for data and AI work. The multi-organ compatibility analysis in BioMatch runs on it.',
    shipped: 'BioMatch',
  },
  {
    symbol: 'Nx',
    name: 'Next.js',
    group: 'Frameworks',
    line: 'My default front end, and the thing rendering this page right now.',
    shipped: 'Agentum · This site',
  },
  {
    symbol: 'Re',
    name: 'React',
    group: 'Frameworks',
    line: 'Components built to be handed over. At LaloDev the reusable set outlived the internship.',
    shipped: 'LaloDev feedback platform',
  },
  {
    symbol: 'Vu',
    name: 'Vue.js',
    group: 'Frameworks',
    line: 'The other way to think about reactivity. In the kit because not every project starts on React.',
  },
  {
    symbol: 'La',
    name: 'Laravel',
    group: 'Frameworks',
    line: 'Eloquent, migrations, and error handling that admits what went wrong. Built the feedback REST layer on it.',
    shipped: 'LaloDev feedback platform',
  },
  {
    symbol: 'Rr',
    name: 'Ruby on Rails',
    group: 'Frameworks',
    line: 'Convention over configuration, and it still holds up. The shortest path I know from idea to working CRUD.',
  },
  {
    symbol: 'Ns',
    name: 'NestJS',
    group: 'Frameworks',
    line: 'Node with a spine: modules, providers, injection. What I reach for when a service needs a shape.',
  },
  {
    symbol: 'Tw',
    name: 'Tailwind',
    group: 'Frameworks',
    line: 'Styling without the naming argument.',
  },
  {
    symbol: 'Nd',
    name: 'Node.js',
    group: 'Runtime & tools',
    line: 'The other side of the API. Endpoints, jobs, and anything that has to run outside a browser.',
  },
  {
    symbol: 'Dk',
    name: 'Docker',
    group: 'Runtime & tools',
    line: 'So that “works on my machine” stops being a sentence anyone has to say.',
  },
  {
    symbol: 'Gt',
    name: 'Git',
    group: 'Runtime & tools',
    line: 'Every project here has a history I can read back.',
  },
  {
    symbol: 'Cy',
    name: 'Cypress',
    group: 'Runtime & tools',
    line: 'Proving the flow works before somebody else finds out it does not.',
  },
  {
    symbol: 'Se',
    name: 'Selenium',
    group: 'Runtime & tools',
    line: 'Browser automation for the tests Cypress is the wrong shape for.',
  },
  {
    symbol: 'Pm',
    name: 'Postman',
    group: 'Runtime & tools',
    line: 'Where an endpoint gets poked at until it behaves.',
  },
];

/** The scrolling ticker under the hero. */
export const tickerItems = [
  'Available for work',
  'Addis Ababa · UTC+3',
  'Full-stack engineering',
  'AI integration',
  'Founder at AfroDigital',
  'Let’s build something',
];
