const isProduction = () => {
  if (process.env.NODE_ENV) {
    return true;
  } else {
    return false;
  }
};

const getUrl = () => {
  if (isProduction()) {
    return process.env.PROD_URL;
  } else {
    return process.env.LOCAL_URL;
  }
};

const jwtCode = process.env.JWT_TOKEN;

module.exports = { getUrl, jwtCode };
