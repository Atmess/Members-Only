// populatedb.js
require("dotenv").config(); // To read your DATABASE_URL from .env
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const dbUrl = process.env.DATABASE_URL;

const dummyUsers = [
  {
    first_name: "Bruce",
    last_name: "Wayne",
    username: "admin_batman",
    password: "password123",
    membership_status: true,
    is_admin: true,
    messageTitle: "The Boss is Here",
    messageText: "I am an admin, which means I can delete anything I want."
  },
  {
    first_name: "Clark",
    last_name: "Kent",
    username: "member_superman",
    password: "password123",
    membership_status: true,
    is_admin: false,
    messageTitle: "Just a Member",
    messageText: "I know the secret passcode, so you can all see my who create this!"
  },
  {
    first_name: "Peter",
    last_name: "Parker",
    username: "standard_spidey",
    password: "password123",
    membership_status: false,
    is_admin: false,
    messageTitle: "Who am I?",
    messageText: "I don't know the passcode yet, so it show up as Anonymous."
  }
];

async function seedDatabase() {
  console.log("Connecting to database...");
  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    for (const user of dummyUsers) {
      console.log(`Hashing password and creating user: ${user.username}...`);
      
      // 1. Hash the password for this specific user
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // 2. Insert the user and RETURNING id to grab their new database ID
      const userResult = await client.query(
        `INSERT INTO users (first_name, last_name, username, password, membership_status, is_admin) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
        [user.first_name, user.last_name, user.username, hashedPassword, user.membership_status, user.is_admin]
      );
      
      const newUserId = userResult.rows[0].id;

      // 3. Insert a message tied directly to their new ID
      console.log(`Creating message for ${user.username}...`);
      await client.query(
        `INSERT INTO messages (title, text, user_id) 
         VALUES ($1, $2, $3);`,
        [user.messageTitle, user.messageText, newUserId]
      );
    }
    
    console.log("Database seeded successfully! You can now log in with these accounts.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase();