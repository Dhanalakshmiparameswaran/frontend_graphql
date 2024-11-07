module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      '\\.(scss|sass|css)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
  };
  