import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('action').notNullable(); // CREATE, UPDATE, DELETE, ARCHIVE
    table.string('entity_type').notNullable(); // project, user
    table.uuid('entity_id').notNullable();
    table.jsonb('old_values');
    table.jsonb('new_values');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.raw('CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id)');
  await knex.schema.raw('CREATE INDEX idx_audit_logs_user ON audit_logs (user_id)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_logs');
}
