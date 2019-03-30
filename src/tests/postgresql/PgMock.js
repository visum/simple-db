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