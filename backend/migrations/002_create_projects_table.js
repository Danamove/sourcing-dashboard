/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function(knex) {
  await knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('company').notNullable();
    table.string('sourcer').notNullable();
    table.enum('group_type', ['Israel', 'Global']).notNullable();
    table.enum('model_type', ['Hourly', 'Success', 'Success Executive']).notNullable();
    table.string('roles');
    table.integer('roles_count').defaultTo(1);
    table.integer('hours_or_hires');
    table.date('start_date');
    table.date('end_date');
    table.string('time_to_hire');
    table.text('notes');
    table.enum('status', ['active', 'completed', 'archived']).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.raw('CREATE INDEX idx_projects_company ON projects (company)');
  await knex.schema.raw('CREATE INDEX idx_projects_sourcer ON projects (sourcer)');
  await knex.schema.raw('CREATE INDEX idx_projects_group_type ON projects (group_type)');
  await knex.schema.raw('CREATE INDEX idx_projects_status ON projects (status)');
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('projects');
};
