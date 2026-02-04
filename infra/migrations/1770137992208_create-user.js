exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // For reference, Github limits usernames to 39 characters
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // Why 60 in length?
    // reference: https://security.stackexchange.com/a/184090
    // reference: https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    // Why timestamp with timezone?
    // reference: https://justatheory.com/2012/04/postgres-use-timestamptz
    created_at: {
      type: "timestamptz", //Timezone
      default: pgm.func("timezone('utc', now())"),
      notFound: true,
    },
    updated_at: {
      type: "timestamptz", //Timezone
      default: pgm.func("timezone('utc', now())"),
      notFound: true,
    },
  });
};

exports.down = false;
