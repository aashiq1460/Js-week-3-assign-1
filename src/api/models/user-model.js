import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

const addUser = async (user) => {
  const {name, username, email, password, role} = user;

  const sql = `
    INSERT INTO wsk_users
    (name, username, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [name, username, email, password, role];

  const [result] = await promisePool.execute(sql, params);

  if (result.affectedRows === 0) {
    return false;
  }

  return {user_id: result.insertId};
};

const modifyUser = async (user, id) => {
  const sql = promisePool.format(
    'UPDATE wsk_users SET ? WHERE user_id = ?',
    [user, id]
  );

  const [result] = await promisePool.query(sql);

  if (result.affectedRows === 0) {
    return false;
  }

  return {message: 'success'};
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete all cats owned by the user first
    await connection.execute(
      'DELETE FROM wsk_cats WHERE owner = ?',
      [id]
    );

    // Delete the user
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();

    return {message: 'success'};
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
const findUserByUsername = async (username) => {
  const sql = `
    SELECT *
    FROM wsk_users
    WHERE username = ?
  `;

  const [rows] = await promisePool.execute(sql, [username]);

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
  findUserByUsername,
};