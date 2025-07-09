import { 
  boolean, 
  integer, 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  varchar,
  decimal,
  jsonb,
  inet,
  unique,
  index,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due', 'trialing', 'incomplete']);
export const companyStatusEnum = pgEnum('company_status', ['active', 'inactive', 'blacklist']);
export const campaignTypeEnum = pgEnum('campaign_type', ['email', 'form', 'mixed']);
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'active', 'paused', 'completed', 'canceled']);
export const activityTypeEnum = pgEnum('activity_type', ['email', 'form', 'call', 'meeting', 'note']);
export const activityStatusEnum = pgEnum('activity_status', ['pending', 'processing', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed']);
export const templateTypeEnum = pgEnum('template_type', ['email', 'form', 'subject']);
export const logLevelEnum = pgEnum('log_level', ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']);

// Users and Authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  supabaseUserId: uuid('supabase_user_id').notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Tokyo'),
  locale: varchar('locale', { length: 10 }).default('ja'),
  status: userStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  supabaseUserIdIdx: index('idx_users_supabase_user_id').on(table.supabaseUserId),
  emailIdx: index('idx_users_email').on(table.email),
}));

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique(),
  planId: varchar('plan_id', { length: 50 }).notNull(),
  status: subscriptionStatusEnum('status').notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  trialEnd: timestamp('trial_end'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_subscriptions_user_id').on(table.userId),
}));

export const usageMetrics = pgTable('usage_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  metricType: varchar('metric_type', { length: 50 }).notNull(),
  metricValue: integer('metric_value').notNull().default(0),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userMetricPeriodUnique: unique('usage_metrics_user_metric_period_unique').on(table.userId, table.metricType, table.periodStart),
  userIdMetricTypeIdx: index('idx_usage_metrics_user_metric').on(table.userId, table.metricType),
}));

// Companies and Lists
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 255 }),
  websiteUrl: text('website_url'),
  industry: varchar('industry', { length: 100 }),
  employeeCountRange: varchar('employee_count_range', { length: 50 }),
  revenueRange: varchar('revenue_range', { length: 50 }),
  country: varchar('country', { length: 100 }).default('Japan'),
  prefecture: varchar('prefecture', { length: 50 }),
  city: varchar('city', { length: 100 }),
  description: text('description'),
  status: companyStatusEnum('status').default('active'),
  lastContactedAt: timestamp('last_contacted_at'),
  responseStatus: varchar('response_status', { length: 20 }),
  tags: text('tags').array(),
  customFields: jsonb('custom_fields'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userIdStatusIdx: index('idx_companies_user_id_status').on(table.userId, table.status),
  domainIdx: index('idx_companies_domain').on(table.domain),
  lastContactedIdx: index('idx_companies_last_contacted').on(table.lastContactedAt),
}));

export const companyContacts = pgTable('company_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  contactType: varchar('contact_type', { length: 20 }).notNull(),
  value: varchar('value', { length: 500 }).notNull(),
  contactPersonName: varchar('contact_person_name', { length: 255 }),
  contactPersonTitle: varchar('contact_person_title', { length: 255 }),
  department: varchar('department', { length: 100 }),
  isPrimary: boolean('is_primary').default(false),
  isVerified: boolean('is_verified').default(false),
  verificationDate: timestamp('verification_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  companyIdIdx: index('idx_company_contacts_company_id').on(table.companyId),
}));

export const companyLists = pgTable('company_lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  totalCompanies: integer('total_companies').default(0),
  tags: text('tags').array(),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userIdIdx: index('idx_company_lists_user_id').on(table.userId),
}));

export const companyListItems = pgTable('company_list_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  listId: uuid('list_id').notNull().references(() => companyLists.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  position: integer('position'),
  customData: jsonb('custom_data'),
  addedAt: timestamp('added_at').defaultNow(),
}, (table) => ({
  listCompanyUnique: unique('company_list_items_list_company_unique').on(table.listId, table.companyId),
  listIdIdx: index('idx_company_list_items_list_id').on(table.listId),
}));

// Campaigns and Sales Activities
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listId: uuid('list_id').notNull().references(() => companyLists.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 255 }).notNull(),
  campaignType: campaignTypeEnum('campaign_type').notNull(),
  status: campaignStatusEnum('status').default('draft'),
  targetCount: integer('target_count'),
  successCount: integer('success_count').default(0),
  aiConfig: jsonb('ai_config').notNull().default('{}'),
  templateConfig: jsonb('template_config').notNull().default('{}'),
  scheduleConfig: jsonb('schedule_config').default('{}'),
  rateLimitConfig: jsonb('rate_limit_config').default('{"per_hour": 10, "per_day": 100}'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdStatusIdx: index('idx_campaigns_user_id_status').on(table.userId, table.status),
}));

export const salesActivities = pgTable('sales_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  activityType: activityTypeEnum('activity_type').notNull(),
  status: activityStatusEnum('status').notNull(),
  channel: varchar('channel', { length: 20 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  content: text('content'),
  responseContent: text('response_content'),
  metadata: jsonb('metadata').default('{}'),
  scheduledAt: timestamp('scheduled_at'),
  executedAt: timestamp('executed_at'),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  campaignCompanyIdx: index('idx_sales_activities_campaign_company').on(table.campaignId, table.companyId),
  statusScheduledIdx: index('idx_sales_activities_status_scheduled').on(table.status, table.scheduledAt),
}));

export const emailActivities = pgTable('email_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  activityId: uuid('activity_id').notNull().references(() => salesActivities.id, { onDelete: 'cascade' }),
  toEmail: varchar('to_email', { length: 255 }).notNull(),
  fromEmail: varchar('from_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  content: text('content').notNull(),
  htmlContent: text('html_content'),
  trackingId: varchar('tracking_id', { length: 255 }).unique(),
  sentAt: timestamp('sent_at'),
  openedAt: timestamp('opened_at'),
  clickedAt: timestamp('clicked_at'),
  repliedAt: timestamp('replied_at'),
  bouncedAt: timestamp('bounced_at'),
  bounceReason: text('bounce_reason'),
  smtpResponse: text('smtp_response'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  trackingIdIdx: index('idx_email_activities_tracking_id').on(table.trackingId),
  openedAtIdx: index('idx_email_activities_opened_at').on(table.openedAt),
}));

export const formActivities = pgTable('form_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  activityId: uuid('activity_id').notNull().references(() => salesActivities.id, { onDelete: 'cascade' }),
  formUrl: text('form_url').notNull(),
  formFields: jsonb('form_fields').notNull(),
  submittedAt: timestamp('submitted_at'),
  success: boolean('success').default(false),
  errorMessage: text('error_message'),
  hasRecaptcha: boolean('has_recaptcha').default(false),
  recaptchaVersion: varchar('recaptcha_version', { length: 10 }),
  responseHtml: text('response_html'),
  createdAt: timestamp('created_at').defaultNow(),
});

// AI and Templates
export const aiTemplates = pgTable('ai_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  templateType: templateTypeEnum('template_type').notNull(),
  industry: varchar('industry', { length: 100 }),
  tone: varchar('tone', { length: 50 }).notNull(),
  language: varchar('language', { length: 10 }).default('ja'),
  templateContent: text('template_content').notNull(),
  variables: jsonb('variables').default('[]'),
  usageCount: integer('usage_count').default(0),
  isPublic: boolean('is_public').default(false),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdTypeIdx: index('idx_ai_templates_user_type').on(table.userId, table.templateType),
}));

export const aiGenerations = pgTable('ai_generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').references(() => aiTemplates.id, { onDelete: 'set null' }),
  inputData: jsonb('input_data').notNull(),
  generatedContent: text('generated_content').notNull(),
  promptTokens: integer('prompt_tokens'),
  completionTokens: integer('completion_tokens'),
  totalTokens: integer('total_tokens'),
  modelUsed: varchar('model_used', { length: 50 }),
  generationTimeMs: integer('generation_time_ms'),
  costUsd: decimal('cost_usd', { precision: 10, scale: 6 }),
  qualityRating: integer('quality_rating'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdCreatedIdx: index('idx_ai_generations_user_created').on(table.userId, table.createdAt),
}));

// Audit and Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  tableName: varchar('table_name', { length: 100 }).notNull(),
  recordId: uuid('record_id').notNull(),
  action: varchar('action', { length: 20 }).notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userTableCreatedIdx: index('idx_audit_logs_user_table_created').on(table.userId, table.tableName, table.createdAt),
}));

export const systemLogs = pgTable('system_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  level: logLevelEnum('level').notNull(),
  message: text('message').notNull(),
  module: varchar('module', { length: 100 }),
  functionName: varchar('function_name', { length: 100 }),
  lineNumber: integer('line_number'),
  context: jsonb('context'),
  traceId: varchar('trace_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  levelCreatedIdx: index('idx_system_logs_level_created').on(table.level, table.createdAt),
}));

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  subscriptions: many(subscriptions),
  companies: many(companies),
  companyLists: many(companyLists),
  campaigns: many(campaigns),
  aiTemplates: many(aiTemplates),
  aiGenerations: many(aiGenerations),
  usageMetrics: many(usageMetrics),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
  contacts: many(companyContacts),
  listItems: many(companyListItems),
  salesActivities: many(salesActivities),
}));

export const companyContactsRelations = relations(companyContacts, ({ one }) => ({
  company: one(companies, {
    fields: [companyContacts.companyId],
    references: [companies.id],
  }),
}));

export const companyListsRelations = relations(companyLists, ({ one, many }) => ({
  user: one(users, {
    fields: [companyLists.userId],
    references: [users.id],
  }),
  items: many(companyListItems),
  campaigns: many(campaigns),
}));

export const companyListItemsRelations = relations(companyListItems, ({ one }) => ({
  list: one(companyLists, {
    fields: [companyListItems.listId],
    references: [companyLists.id],
  }),
  company: one(companies, {
    fields: [companyListItems.companyId],
    references: [companies.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  list: one(companyLists, {
    fields: [campaigns.listId],
    references: [companyLists.id],
  }),
  salesActivities: many(salesActivities),
}));

export const salesActivitiesRelations = relations(salesActivities, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [salesActivities.campaignId],
    references: [campaigns.id],
  }),
  company: one(companies, {
    fields: [salesActivities.companyId],
    references: [companies.id],
  }),
  emailActivity: one(emailActivities),
  formActivity: one(formActivities),
}));

export const emailActivitiesRelations = relations(emailActivities, ({ one }) => ({
  activity: one(salesActivities, {
    fields: [emailActivities.activityId],
    references: [salesActivities.id],
  }),
}));

export const formActivitiesRelations = relations(formActivities, ({ one }) => ({
  activity: one(salesActivities, {
    fields: [formActivities.activityId],
    references: [salesActivities.id],
  }),
}));

export const aiTemplatesRelations = relations(aiTemplates, ({ one, many }) => ({
  user: one(users, {
    fields: [aiTemplates.userId],
    references: [users.id],
  }),
  generations: many(aiGenerations),
}));

export const aiGenerationsRelations = relations(aiGenerations, ({ one }) => ({
  user: one(users, {
    fields: [aiGenerations.userId],
    references: [users.id],
  }),
  template: one(aiTemplates, {
    fields: [aiGenerations.templateId],
    references: [aiTemplates.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type CompanyContact = typeof companyContacts.$inferSelect;
export type NewCompanyContact = typeof companyContacts.$inferInsert;
export type CompanyList = typeof companyLists.$inferSelect;
export type NewCompanyList = typeof companyLists.$inferInsert;
export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type SalesActivity = typeof salesActivities.$inferSelect;
export type NewSalesActivity = typeof salesActivities.$inferInsert;
export type EmailActivity = typeof emailActivities.$inferSelect;
export type NewEmailActivity = typeof emailActivities.$inferInsert;
export type AITemplate = typeof aiTemplates.$inferSelect;
export type NewAITemplate = typeof aiTemplates.$inferInsert;
export type AIGeneration = typeof aiGenerations.$inferSelect;
export type NewAIGeneration = typeof aiGenerations.$inferInsert;

// Legacy compatibility
export type InsertUser = NewUser;
export type SelectUser = User;
export const usersTable = users;
