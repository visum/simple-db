"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class PgWrapper {
  constructor(pool) {
    this.pool = pool;
  }

  async runAsync(sql, values = []) {
    const client = await this.pool.connect();

    try {
      const result = await client.query(sql, values);
      return result;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async allAsync(sql, values = []) {
    const client = await this.pool.connect();

    try {
      const res = await client.query(sql, values);
      return res.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

}

exports.default = PgWrapper;
//# sourceMappingURL=PgWrapper.js.map