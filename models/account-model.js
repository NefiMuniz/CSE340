const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  const sql =
    "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
  const result = await pool.query(sql, [
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  ]);
  return result;
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email, excludedEmail = null) {
  try {
    if(excludedEmail) {
      const sql = "SELECT * FROM account WHERE account_email = $1 AND account_email != $2";
      const email = await pool.query(sql, [account_email, excludedEmail]);
      return email.rowCount;
    }
    else {
      const sql = "SELECT * FROM account WHERE account_email = $1"; 
      const email = await pool.query(sql, [account_email]);
      return email.rowCount;
    }
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount, checkExistingEmail };
