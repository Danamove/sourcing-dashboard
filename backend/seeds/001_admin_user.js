const bcrypt = require('bcryptjs');

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  // Check if admin user already exists
  const existingAdmin = await knex('users').where({ email: 'admin@example.com' }).first();

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await knex('users').insert({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });

    console.log('Admin user created: admin@example.com / admin123');
  } else {
    console.log('Admin user already exists');
  }
};
