module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileStub.ts',
  },
  testPathIgnorePatterns: [
    '/__mocks__',
    '/node_modules/',
    '/coverage/',
  ],
  coveragePathIgnorePatterns: [
    '/src/data/',
  ],
};
