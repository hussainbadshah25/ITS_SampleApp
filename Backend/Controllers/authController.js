const jwt = require("jsonwebtoken");

exports.login = [
  async (req, res) => {
    try {
      const { its_id, password } = req.body;

      if (!req.app.locals.db) {
        return res.status(500).send({ message: "Database connection error." });
      }

      const query = "SELECT * FROM users WHERE its_id = ? AND password = ?";

      try {
        const [results] = await req.app.locals.db.query(query, [
          its_id,
          password,
        ]);

        if (results && results.length > 0) {
          const user = results[0];
          const token = jwt.sign(
            { id: user.id, its_id: user.its_id, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          res.status(200).send({
            data: {
              status: "valid",
              token,
            },
          });
        } else {
          res.status(401).send({
            data: { status: "invalid", message: "Invalid login credentials!!" },
          });
        }
      } catch (dbError) {
        console.error("Database operation error:", dbError);
        res
          .status(500)
          .send({ data: { message: "Login Failed due to some error!" } });
      }
    } catch (error) {
      console.error("Unexpected error in login process:", error);
      res
        .status(500)
        .send({ data: { message: "Unexpected error in login process" } });
    }
  },
];
