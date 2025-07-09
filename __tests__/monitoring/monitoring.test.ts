import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MonitoringService, monitoring } from '@/lib/monitoring';

// Mock Sentry and Clarity
vi.mock('@/lib/monitoring/sentry', () => ({
  initSentry: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

vi.mock('@/lib/monitoring/clarity', () => ({
  initClarity: vi.fn(),
  clarityService: {
    identifyUser: vi.fn(),
    trackError: vi.fn(),
    trackCustomEvent: vi.fn(),
    trackPageView: vi.fn(),
    trackSalesActivity: vi.fn(),
    trackCampaign: vi.fn(),
    trackCompanyInteraction: vi.fn(),
    trackPerformance: vi.fn(),
    trackUserJourney: vi.fn(),
    trackFormSubmit: vi.fn(),
    trackClick: vi.fn(),
    trackABTest: vi.fn(),
  },
}));

describe('MonitoringService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = MonitoringService.getInstance();
      const instance2 = MonitoringService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should export singleton instance', () => {
      expect(monitoring).toBeInstanceOf(MonitoringService);
    });
  });

  describe('Initialization', () => {
    it('should initialize monitoring services', () => {
      const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      monitoring.init();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('Monitoring services initialized');
      mockConsoleLog.mockRestore();
    });

    it('should handle initialization errors', () => {
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock error in initSentry
      vi.doMock('@/lib/monitoring/sentry', () => ({
        initSentry: vi.fn(() => { throw new Error('Sentry init failed'); }),
      }));
      
      monitoring.init();
      
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to initialize monitoring:', expect.any(Error));
      mockConsoleError.mockRestore();
    });
  });

  describe('User Tracking', () => {
    it('should set user information', () => {
      const user = { id: 'user-123', email: 'test@example.com', name: 'Test User' };
      
      monitoring.setUser(user);
      
      // Verify Sentry setUser was called
      expect(vi.mocked(require('@/lib/monitoring/sentry').setUser)).toHaveBeenCalledWith(user);
      
      // Verify Clarity identifyUser was called
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.identifyUser))
        .toHaveBeenCalledWith(user.id, { email: user.email, name: user.name });
    });

    it('should handle user tracking errors', () => {
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock error in setUser
      vi.doMock('@/lib/monitoring/sentry', () => ({
        setUser: vi.fn(() => { throw new Error('Set user failed'); }),
      }));
      
      monitoring.setUser({ id: 'user-123', email: 'test@example.com' });
      
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to set user:', expect.any(Error));
      mockConsoleError.mockRestore();
    });
  });

  describe('Error Tracking', () => {
    it('should track errors with context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent' };
      
      monitoring.trackError(error, context);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').captureException))
        .toHaveBeenCalledWith(error, context);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackError))
        .toHaveBeenCalledWith(error.name, error.message, { stack: error.stack, ...context });
    });

    it('should handle error tracking failures', () => {
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock error in captureException
      vi.doMock('@/lib/monitoring/sentry', () => ({
        captureException: vi.fn(() => { throw new Error('Capture failed'); }),
      }));
      
      monitoring.trackError(new Error('Test error'));
      
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to track error:', expect.any(Error));
      mockConsoleError.mockRestore();
    });
  });

  describe('Sales Activity Tracking', () => {
    it('should track sales activities', () => {
      const activityData = { campaignId: 'campaign-123', companyId: 'company-456' };
      
      monitoring.trackSalesActivity('email', activityData);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith('Sales activity: email', 'business', activityData);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackSalesActivity))
        .toHaveBeenCalledWith('email', activityData);
    });

    it('should track campaign actions', () => {
      const campaignData = { id: 'campaign-123', name: 'Test Campaign' };
      
      monitoring.trackCampaign('created', campaignData);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith('Campaign created', 'business', campaignData);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackCampaign))
        .toHaveBeenCalledWith('created', campaignData);
    });

    it('should track company interactions', () => {
      const companyData = { id: 'company-123', name: 'Test Company' };
      
      monitoring.trackCompanyInteraction('viewed', companyData);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith('Company viewed', 'business', companyData);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackCompanyInteraction))
        .toHaveBeenCalledWith('viewed', companyData);
    });
  });

  describe('Performance Tracking', () => {
    it('should track performance metrics', () => {
      const metric = 'page_load_time';
      const value = 1250;
      const additionalData = { route: '/dashboard' };
      
      monitoring.trackPerformance(metric, value, additionalData);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith(`Performance: ${metric} = ${value}`, 'performance', additionalData);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackPerformance))
        .toHaveBeenCalledWith(metric, value, additionalData);
    });
  });

  describe('User Journey Tracking', () => {
    it('should track user journey steps', () => {
      const step = 'onboarding_completed';
      const data = { duration: 300000 };
      
      monitoring.trackUserJourney(step, data);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith(`Journey: ${step}`, 'journey', data);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackUserJourney))
        .toHaveBeenCalledWith(step, data);
    });
  });

  describe('Form and Click Tracking', () => {
    it('should track form submissions', () => {
      const formName = 'contact_form';
      const formData = { fields: 5, hasErrors: false };
      
      monitoring.trackFormSubmit(formName, formData);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith(`Form submit: ${formName}`, 'user', formData);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackFormSubmit))
        .toHaveBeenCalledWith(formName, formData);
    });

    it('should track click events', () => {
      const elementName = 'create_campaign_button';
      const additionalData = { section: 'dashboard' };
      
      monitoring.trackClick(elementName, additionalData);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith(`Click: ${elementName}`, 'user', additionalData);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackClick))
        .toHaveBeenCalledWith(elementName, additionalData);
    });
  });

  describe('A/B Testing', () => {
    it('should track A/B test assignments', () => {
      const testName = 'new_dashboard_layout';
      const variant = 'variant_b';
      const data = { userId: 'user-123' };
      
      monitoring.trackABTest(testName, variant, data);
      
      expect(vi.mocked(require('@/lib/monitoring/sentry').addBreadcrumb))
        .toHaveBeenCalledWith(`A/B Test: ${testName} = ${variant}`, 'experiment', data);
      
      expect(vi.mocked(require('@/lib/monitoring/clarity').clarityService.trackABTest))
        .toHaveBeenCalledWith(testName, variant, data);
    });
  });
});