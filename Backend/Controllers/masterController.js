const jwt = require("jsonwebtoken");

const getCountries = async (req, res) => {
  try {
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query = "SELECT * FROM countries";

    try {
      const [results] = await req.app.locals.db.query(query);

      res.status(200).send({
        data: {
          results,
        },
      });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      res.status(500).send({ data: { message: "database connection error" } });
    }
  } catch (error) {
    console.error("Unexpected error in fetching countries", error);
    res
      .status(500)
      .send({ data: { message: "Unexpected error in fetching countries" } });
  }
};

const getCities = async (req, res) => {
  try {
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query = "SELECT * FROM cities WHERE country_id = ?";

    try {
      const [results] = await req.app.locals.db.query(query, [
        req.params.countryId,
      ]);

      res.status(200).send({
        data: {
          results,
        },
      });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      res.status(500).send({ data: { message: "database connection error" } });
    }
  } catch (error) {
    console.error("Unexpected error in fetching cities", error);
    res
      .status(500)
      .send({ data: { message: "Unexpected error in fetching cities" } });
  }
};

const getCountriesCities = async (req, res) => {
  try {
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query =
      "SELECT c.name AS Country_Name, c.code, ct.name AS City_Name FROM countries c INNER JOIN cities ct ON c.id = ct.country_id";

    try {
      const [results] = await req.app.locals.db.query(query);

      res.status(200).send({
        data: {
          results,
        },
      });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      res.status(500).send({ data: { message: "database connection error" } });
    }
  } catch (error) {
    console.error("Unexpected error in fetching countries", error);
    res
      .status(500)
      .send({ data: { message: "Unexpected error in fetching countries" } });
  }
};

const gethobbies = async (req, res) => {
  try {
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query = "SELECT * FROM hobbies";

    try {
      const [results] = await req.app.locals.db.query(query);

      res.status(200).send({
        data: {
          results,
        },
      });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      res.status(500).send({ data: { message: "database connection error" } });
    }
  } catch (error) {
    console.error("Unexpected error in fetching hobbies", error);
    res
      .status(500)
      .send({ data: { message: "Unexpected error in fetching hobbies" } });
  }
};

module.exports = {
  getCountries,
  getCities,
  gethobbies,
  getCountriesCities,
};
