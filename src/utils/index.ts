const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const jwtCode = process.env.JWT_TOKEN;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const isProduction = () => {
  if (process.env.DEVELOPMENT) {
    return false;
  } else {
    return true;
  }
};

const getUrl = () => {
  if (isProduction()) {
    return process.env.PROD_URL;
  } else {
    return process.env.LOCAL_URL;
  }
};

const sendEmail = async (props: any) => {
  const { msg } = props;

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
    })
    .catch((error) => {
      console.error(error);
    });
};

const validateToken = (req, res, next) => {
  const authorizationHeaader = req.headers.authorization;

  let result;
  if (authorizationHeaader) {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    console.log(token);
    const options = {};
    try {
      // verify makes sure that the token hasn't expired and has been issued by us
      result = jwt.verify(token, jwtCode, options);

      // Let's pass back the decoded token to the request object
      req.decoded = result;
      // We call next to pass execution to the subsequent middleware
      next();
    } catch (err) {
      // Throw an error just in case anything goes wrong with verification
      result = {
        error: `Authentication error`,
        status: 401,
      };
      res.status(401).send(result);
    }
  } else {
    result = {
      error: `Authentication error. Token required.`,
      status: 402,
    };
    res.status(402).send(result);
  }
};

function uniqBy(a, key) {
  var seen = {};
  return a.filter(function (item) {
    var k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

module.exports = {
  isProduction,
  getUrl,
  jwtCode,
  validateToken,
  sendEmail,
  uniqBy,
};
