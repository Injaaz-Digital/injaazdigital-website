import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/components/ProgressStages.jsx',
      'src/components/Header2.jsx',
      'src/components/Promises.jsx',
      'src/site-pages/DynamicHomePage.jsx',
    ],
    rules: {
      '@next/next/no-img-element': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default config;
