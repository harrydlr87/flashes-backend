// Workaround for babel import aliases
System.config({
  paths: {
    '@Config/*': './src/app/config/*',
    '@Common/*': './src/common/*',
    '@Middleware/*': './src/app/middleware/*',
  },
});
