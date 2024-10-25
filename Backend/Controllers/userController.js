const jwt = require("jsonwebtoken");

const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query = `SELECT 
    up.*,
    u.its_id as ITS,
    c.name as Country_name,
    ct.name as city_name,
    GROUP_CONCAT(h.id) as hobbies
FROM user_profiles up
LEFT JOIN users u ON u.id = up.id
LEFT JOIN countries c ON up.country_id = c.id
LEFT JOIN cities ct ON up.city_id = ct.id
LEFT JOIN user_hobbies uh ON up.user_id = uh.user_id
LEFT JOIN hobbies h ON uh.hobby_id = h.id
WHERE up.user_id = ?
GROUP BY up.id`;

    const [results] = await req.app.locals.db.query(query, [userId]);
    res.json(results[0]);
  } catch (error) {
    console.error("Unexpected error in fetching UserProfile", error);
    res
      .status(500)
      .send({ data: { message: "Unexpected error in fetching UserProfile" } });
  }
};

const getUsersProfiles = async (req, res) => {
  try {
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query = `SELECT u.its_id, u.is_admin, up.*, c.name AS Country_Name, ci.name AS City_Name
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    LEFT JOIN countries c ON up.country_id = c.id
    LEFT JOIN cities ci ON up.city_id = ci.id`;

    try {
      const [results] = await req.app.locals.db.query(query);
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          const [userHobbies] = await req.app.locals.db.query(
            `SELECT name FROM hobbies INNER JOIN user_hobbies
            ON hobbies.id = user_hobbies.hobby_id
            WHERE user_id = ?`,
            [results[i].user_id]
          );
          results[i].hobbies = userHobbies.map((h) => h.name);
        }

        res.json(results);
      } else {
        res.status(404).json({ message: "users not found" });
      }
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      res.status(500).send({ data: { message: "database connection error" } });
    }
  } catch (error) {
    console.error("Unexpected error in fetching users", error);
    res
      .status(500)
      .send({ data: { message: "Unexpected error in fetching users" } });
  }
};

const addUser = async (req, res) => {
  const { its_id, password, is_admin, username } = req.body.values;
  try {
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query = `
        INSERT INTO users (its_id, password, is_admin)
        VALUES (?, ?, ?)
      `;
    const query1 = `
      INSERT INTO user_profiles (user_id, name)
      VALUES (?, ?)
    `;
    try {
      const [results] = await req.app.locals.db.query(query, [
        its_id,
        password,
        is_admin,
      ]);
      const insertedId = results.insertId;
      const [results1] = await req.app.locals.db.query(query1, [
        insertedId,
        username,
      ]);

      if (results.affectedRows === 0 && results1.affectedRows === 0) {
        return res.status(500).send({ message: "Failed to add user" });
      }

      res.status(201).send({
        message: `User added successfully`,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).send({
        message: "Failed to add user due to a database error.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An unexpected error occurred while adding user.",
    });
  }
};

const updateUserProfile = async (req, res) => {
  const {
    user_id,
    name,
    age,
    gender,
    mobile,
    email,
    marital_status,
    address,
    country,
    city,
    hobbies,
  } = req.body;

  try {
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    // Update user profile details in user_profiles
    const profileQuery = `
      UPDATE user_profiles 
      SET age = ?, gender = ?, mobile = ?, email = ?, marital_status = ?, address = ?, country_id = ?, city_id = ? 
      WHERE user_id = ?
    `;
    await req.app.locals.db.query(profileQuery, [
      age,
      gender,
      mobile,
      email,
      marital_status,
      address,
      country,
      city,
      user_id,
    ]);

    // Delete existing hobbies for the user from user_hobbies
    const deleteHobbiesQuery = `DELETE FROM user_hobbies WHERE user_id = ?`;
    await req.app.locals.db.query(deleteHobbiesQuery, [user_id]);

    // Insert new hobbies for the user
    const insertHobbiesQuery = `INSERT INTO user_hobbies (user_id, hobby_id) VALUES (?, ?)`;
    const hobbyPromises = hobbies.map((hobbyId) =>
      req.app.locals.db.query(insertHobbiesQuery, [user_id, hobbyId])
    );
    await Promise.all(hobbyPromises);

    res.status(200).send({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({
      message: "An unexpected error occurred while updating the user profile.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.app.locals.db) {
      return res.status(500).send({ message: "Database connection error." });
    }

    const query = `DELETE FROM user_hobbies WHERE user_id = ?`;
    const query1 = `DELETE FROM user_profiles WHERE user_id = ?`;
    const query2 = `DELETE FROM users WHERE id = ?`;

    const [results] = await req.app.locals.db.query(query, [userId]);
    const [results1] = await req.app.locals.db.query(query1, [userId]);
    const [results2] = await req.app.locals.db.query(query2, [userId]);

    if (
      results.affectedRows === 0 &&
      results1.affectedRows === 0 &&
      results2.affectedRows === 0
    ) {
      return res.status(500).send({ message: "Failed to delete user" });
    }
    res.status(201).send({
      message: `User deleted successfully`,
    });
  } catch (error) {
    console.error("Unexpected error in fetching UserProfile", error);
    res
      .status(500)
      .send({ data: { message: "Unexpected error in fetching UserProfile" } });
  }
};

module.exports = {
  getUserProfileById,
  getUsersProfiles,
  addUser,
  updateUserProfile,
  deleteUser,
};
