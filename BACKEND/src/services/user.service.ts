import { pool } from '../config/db.config';
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import lodash from "lodash";
import { UserDetails } from "../models/user.interface";

export class userService {
  async registerUser(user: UserDetails) {
    let user_id = v4();
    let hashedPassword = bcrypt.hashSync(user.password, 6);
    console.log(hashedPassword);

    let emailExistResult = await pool.query('SELECT * FROM Users WHERE email = $1', [user.email]);
    let emailExist = emailExistResult.rows;

    console.log(emailExist[0]);
    if (!lodash.isEmpty(emailExist)) {
      const { password, ...userWithoutPassword } = emailExist[0];
      return {
        ...userWithoutPassword,
        message: "User already registered, returning details",
        user_id: emailExist[0].user_id,
        userId: emailExist[0].user_id,
        id: emailExist[0].user_id
      };
    }
    console.log("service", user);

    let result = await pool.query(
      'INSERT INTO Users (user_id, username, email, password, "isActive", role) VALUES ($1, $2, $3, $4, true, \'user\')',
      [user_id, user.username, user.email, hashedPassword]
    );

    if (result.rowCount === 1) {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        message: "User registered successfully",
        user_id,
        userId: user_id,
        id: user_id,
        user: {
          ...userWithoutPassword,
          user_id,
          userId: user_id,
          id: user_id
        }
      };
    } else {
      return {
        error: "User not registered",
      };
    }
  }

  async fetchAllUsers() {
    let result = await pool.query('SELECT user_id, username, email, role, "isActive" as "isActive" FROM Users WHERE role IN (\'user\', \'manager\')');
    return result.rows;
  }

  async fetchUsers() {
    let result = await pool.query('SELECT user_id, username, email, role, "isActive" as "isActive" FROM Users WHERE role = \'user\'');
    return result.rows;
  }

  async fetchSingleUser(user_id: string) {
    let result = await pool.query('SELECT user_id, username, email, password, role, "isActive" as "isActive" FROM Users WHERE user_id = $1', [user_id]);
    let userRows = result.rows;

    if (userRows.length === 0) {
      return {
        error: "User not found",
      };
    } else {
      return {
        user: userRows[0],
      };
    }
  }

  async switchRoles(user_id: string) {
    let response = await this.fetchSingleUser(user_id);

    if (response.user && response.user.user_id) {
      let updateResult = await pool.query(
        "UPDATE Users SET role = 'manager' WHERE role = 'user' AND user_id = $1",
        [user_id]
      );

      if (updateResult.rowCount === 0) {
        return {
          error: "Unable to change user role",
        };
      } else {
        return {
          message: "User role changed successfully",
        };
      }
    } else {
      return {
        error: "User not found",
      };
    }
  }

  async updateUserDetails(email: string, password: string) {
    let user_password = bcrypt.hashSync(password, 6);
    console.log(user_password);

    let emailExistResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    let emailExist = emailExistResult.rows;

    if (lodash.isEmpty(emailExist)) {
      return {
        error: "Email doesn't exists",
      };
    } else {
      let result = await pool.query(
        'UPDATE Users SET password = $1 WHERE email = $2',
        [user_password, email]
      );

      if (result.rowCount === 0) {
        return {
          error: "Unable to update user details",
        };
      } else {
        return {
          message: "User password updated successfully",
          email,
          user_password,
        };
      }
    }
  }

  async updateUserCredentials(user: UserDetails) {
    let user_password = bcrypt.hashSync(user.password, 6);

    let userResult = await pool.query('SELECT * FROM Users WHERE user_id = $1', [user.user_id]);
    let userExists = userResult.rows;

    if (lodash.isEmpty(userExists)) {
      return {
        error: 'user not found'
      }
    } else {
      let result = await pool.query(
        'UPDATE Users SET username = $1, email = $2, password = $3 WHERE user_id = $4',
        [user.username, user.email, user_password, user.user_id]
      );

      if (result.rowCount === 0) {
        return {
          error: "Unable to update user details"
        }
      } else {
        return {
          message: "User details updated successfully"
        }
      }
    }
  }

  async deactivateUser(user_id: string) {
    try {
      let userResult = await pool.query('SELECT * FROM Users WHERE user_id = $1 AND "isActive" = true', [user_id]);

      if (userResult.rows.length === 0) {
        return {
          message: 'User not found or already deactivated'
        };
      }

      await pool.query('UPDATE Users SET "isActive" = false WHERE user_id = $1', [user_id]);

      return {
        message: 'User deactivated successfully'
      };
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  }

  async activateUser(user_id: string) {
    try {
      let userResult = await pool.query('SELECT * FROM Users WHERE user_id = $1 AND "isActive" = false', [user_id]);

      if (userResult.rows.length === 0) {
        return {
          message: 'User not found or already active'
        };
      }

      await pool.query('UPDATE Users SET "isActive" = true WHERE user_id = $1', [user_id]);

      return {
        message: 'User activated successfully'
      };
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  }

  async getNumberOfUsers() {
    try {
      let result = await pool.query('SELECT COUNT(*) as "numberOfUsers" FROM Users');
      return { numberOfUsers: parseInt(result.rows[0].numberOfUsers) };
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  }

  async getUserRolesCount() {
    try {
      let result = await pool.query('SELECT role as "userRole", COUNT(*) as "roleCount" FROM Users GROUP BY role');
      let roleCounts = result.rows.reduce((acc: any, row: any) => {
        acc[`User Role: ${row.userRole}`] = parseInt(row.roleCount);
        return acc;
      }, {});
      return roleCounts;
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  }

  async deleteUser(user_id: string) {
    try {
      let result = await pool.query('DELETE FROM Users WHERE user_id = $1', [user_id]);

      if (result.rowCount && result.rowCount > 0) {
        return { message: "User deleted successfully" };
      } else {
        return { error: "User not found" };
      }
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  }
}

