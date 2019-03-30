"use strict";

class PgClientMock {
  query(text, values) {
    return Promise.resolve([]);
  }

}

class PgPoolMock {
  connect() {
    return new PgClientMock();
  }

}
//# sourceMappingURL=PgMock.js.map