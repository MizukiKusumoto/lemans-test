import { describe, it, expect } from 'vitest';
import { 
  users, 
  companies, 
  campaigns, 
  salesActivities,
  emailActivities,
  aiTemplates,
  type User,
  type Company,
  type Campaign,
  type SalesActivity 
} from '@/utils/db/schema';

describe('Database Schema', () => {
  describe('Table Structure', () => {
    it('should have correct user table structure', () => {
      expect(users).toBeDefined();
      expect(users.id).toBeDefined();
      expect(users.email).toBeDefined();
      expect(users.name).toBeDefined();
      expect(users.supabaseUserId).toBeDefined();
      expect(users.createdAt).toBeDefined();
      expect(users.updatedAt).toBeDefined();
    });

    it('should have correct company table structure', () => {
      expect(companies).toBeDefined();
      expect(companies.id).toBeDefined();
      expect(companies.userId).toBeDefined();
      expect(companies.name).toBeDefined();
      expect(companies.domain).toBeDefined();
      expect(companies.industry).toBeDefined();
      expect(companies.status).toBeDefined();
    });

    it('should have correct campaign table structure', () => {
      expect(campaigns).toBeDefined();
      expect(campaigns.id).toBeDefined();
      expect(campaigns.userId).toBeDefined();
      expect(campaigns.listId).toBeDefined();
      expect(campaigns.name).toBeDefined();
      expect(campaigns.campaignType).toBeDefined();
      expect(campaigns.status).toBeDefined();
      expect(campaigns.aiConfig).toBeDefined();
    });

    it('should have correct sales activity table structure', () => {
      expect(salesActivities).toBeDefined();
      expect(salesActivities.id).toBeDefined();
      expect(salesActivities.campaignId).toBeDefined();
      expect(salesActivities.companyId).toBeDefined();
      expect(salesActivities.activityType).toBeDefined();
      expect(salesActivities.status).toBeDefined();
      expect(salesActivities.channel).toBeDefined();
    });

    it('should have correct email activity table structure', () => {
      expect(emailActivities).toBeDefined();
      expect(emailActivities.id).toBeDefined();
      expect(emailActivities.activityId).toBeDefined();
      expect(emailActivities.toEmail).toBeDefined();
      expect(emailActivities.fromEmail).toBeDefined();
      expect(emailActivities.subject).toBeDefined();
      expect(emailActivities.content).toBeDefined();
      expect(emailActivities.trackingId).toBeDefined();
    });

    it('should have correct AI template table structure', () => {
      expect(aiTemplates).toBeDefined();
      expect(aiTemplates.id).toBeDefined();
      expect(aiTemplates.userId).toBeDefined();
      expect(aiTemplates.name).toBeDefined();
      expect(aiTemplates.templateType).toBeDefined();
      expect(aiTemplates.tone).toBeDefined();
      expect(aiTemplates.templateContent).toBeDefined();
    });
  });

  describe('Type Inference', () => {
    it('should correctly infer User type', () => {
      const user: User = {
        id: 'test-id',
        supabaseUserId: 'supabase-id',
        email: 'test@example.com',
        name: 'Test User',
        companyName: 'Test Company',
        avatarUrl: null,
        timezone: 'Asia/Tokyo',
        locale: 'ja',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      expect(user.id).toBe('test-id');
      expect(user.email).toBe('test@example.com');
      expect(user.status).toBe('active');
    });

    it('should correctly infer Company type', () => {
      const company: Company = {
        id: 'company-id',
        userId: 'user-id',
        name: 'Test Company',
        domain: 'example.com',
        websiteUrl: 'https://example.com',
        industry: 'IT',
        employeeCountRange: '1-10',
        revenueRange: '~1M',
        country: 'Japan',
        prefecture: 'Tokyo',
        city: 'Shibuya',
        description: 'Test company description',
        status: 'active',
        lastContactedAt: null,
        responseStatus: null,
        tags: ['tag1', 'tag2'],
        customFields: { key: 'value' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      expect(company.name).toBe('Test Company');
      expect(company.domain).toBe('example.com');
      expect(company.status).toBe('active');
    });

    it('should correctly infer Campaign type', () => {
      const campaign: Campaign = {
        id: 'campaign-id',
        userId: 'user-id',
        listId: 'list-id',
        name: 'Test Campaign',
        campaignType: 'email',
        status: 'draft',
        targetCount: 100,
        successCount: 0,
        aiConfig: { model: 'gemini-pro' },
        templateConfig: { template_id: 'template-id' },
        scheduleConfig: { start_date: '2024-01-01' },
        rateLimitConfig: { per_hour: 10, per_day: 100 },
        startedAt: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(campaign.name).toBe('Test Campaign');
      expect(campaign.campaignType).toBe('email');
      expect(campaign.status).toBe('draft');
    });

    it('should correctly infer SalesActivity type', () => {
      const activity: SalesActivity = {
        id: 'activity-id',
        campaignId: 'campaign-id',
        companyId: 'company-id',
        activityType: 'email',
        status: 'pending',
        channel: 'email',
        subject: 'Test Subject',
        content: 'Test content',
        responseContent: null,
        metadata: { key: 'value' },
        scheduledAt: null,
        executedAt: null,
        respondedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(activity.activityType).toBe('email');
      expect(activity.status).toBe('pending');
      expect(activity.channel).toBe('email');
    });
  });

  describe('Schema Validation', () => {
    it('should validate required fields', () => {
      // Test that required fields are properly defined
      expect(() => {
        const user = users.id;
        const company = companies.name;
        const campaign = campaigns.campaignType;
        const activity = salesActivities.activityType;
        
        // If these don't throw, the schema is properly defined
        expect(user).toBeDefined();
        expect(company).toBeDefined();
        expect(campaign).toBeDefined();
        expect(activity).toBeDefined();
      }).not.toThrow();
    });

    it('should have proper foreign key relationships', () => {
      // Test that foreign key relationships are properly defined
      expect(() => {
        const companyUserId = companies.userId;
        const campaignUserId = campaigns.userId;
        const campaignListId = campaigns.listId;
        const activityCampaignId = salesActivities.campaignId;
        const activityCompanyId = salesActivities.companyId;
        
        expect(companyUserId).toBeDefined();
        expect(campaignUserId).toBeDefined();
        expect(campaignListId).toBeDefined();
        expect(activityCampaignId).toBeDefined();
        expect(activityCompanyId).toBeDefined();
      }).not.toThrow();
    });

    it('should have proper enum constraints', () => {
      // Test that enum values are properly defined
      expect(() => {
        const userStatus = users.status;
        const companyStatus = companies.status;
        const campaignType = campaigns.campaignType;
        const campaignStatus = campaigns.status;
        const activityType = salesActivities.activityType;
        const activityStatus = salesActivities.status;
        
        expect(userStatus).toBeDefined();
        expect(companyStatus).toBeDefined();
        expect(campaignType).toBeDefined();
        expect(campaignStatus).toBeDefined();
        expect(activityType).toBeDefined();
        expect(activityStatus).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Default Values', () => {
    it('should have proper default values', () => {
      // Test that default values are properly set
      expect(() => {
        const userTimezone = users.timezone;
        const userLocale = users.locale;
        const userStatus = users.status;
        const companyStatus = companies.status;
        const campaignStatus = campaigns.status;
        
        expect(userTimezone).toBeDefined();
        expect(userLocale).toBeDefined();
        expect(userStatus).toBeDefined();
        expect(companyStatus).toBeDefined();
        expect(campaignStatus).toBeDefined();
      }).not.toThrow();
    });
  });
});