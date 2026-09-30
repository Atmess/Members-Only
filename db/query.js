const Pool = require("./Pool")

async function InsertUser(firstName, lastName, username, hashedPassword) {
  const SQL = `
    INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4)
  `;
  await Pool.query(SQL, [firstName, lastName, username, hashedPassword]);
}
async function getmessageUser() {
   const {rows}= await Pool.query('SELECT messages.*, users.username FROM messages JOIN users ON messages.user_id = users.id;');
    return rows;
}

async function getMessage() {
    const {rows}= await Pool.query("SELECT * FROM messages");
    return rows;
}

async function InsertMesssage(user_id, text,title) {
       await Pool.query("INSERT INTO messages (user_id, text,title) VALUES($1,$2,$3) ",[user_id,text,title])
}

async function  DeleteMessage(UserId) {
    await Pool.query("DELETE FROM messages WHERE id = $1",[UserId])
}

async function searchMessages(searchTerm) {
    // Correct: Destructuring { rows } here too!
    const { rows } = await Pool.query(
        "SELECT messages.* FROM messages JOIN users ON messages.user_id = users.id WHERE users.username ILIKE $1 OR messages.title ILIKE $1 OR messages.text ILIKE $1; ", 
        [`%${searchTerm}%`]
    );
    return rows;
}
async function joinmembership(userId) {
    await Pool.query("UPDATE users SET membership_status = true WHERE id = $1", [userId])
}
async function beadmin(userId) {
    await Pool.query("UPDATE users SET is_admin = true WHERE id = $1", [userId])
}
module.exports={InsertUser,InsertMesssage,DeleteMessage,searchMessages,getMessage,getmessageUser,joinmembership,beadmin}