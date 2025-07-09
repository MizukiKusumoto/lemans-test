import { initSentry, captureException, captureMessage, setUser, addBreadcrumb } from './sentry';
import { initClarity, clarityService } from './clarity';

export class MonitoringService {
  private static instance: MonitoringService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public init() {
    if (this.initialized) return;

    try {
      // Sentry 初期化
      initSentry();
      
      // Microsoft Clarity 初期化
      initClarity();
      
      this.initialized = true;
      console.log('Monitoring services initialized');
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
    }
  }

  public setUser(user: { id: string; email: string; name?: string }) {
    try {
      // Sentry にユーザー情報設定
      setUser(user);
      
      // Clarity にユーザー情報設定
      clarityService.identifyUser(user.id, {
        email: user.email,
        name: user.name,
      });
      
      this.trackUserJourney('user_identified', { userId: user.id });
    } catch (error) {
      console.error('Failed to set user:', error);
    }
  }

  public trackError(error: Error, context?: any) {
    try {
      // Sentry にエラー送信
      captureException(error, context);
      
      // Clarity にエラー記録
      clarityService.trackError(
        error.name,
        error.message,
        { stack: error.stack, ...context }
      );
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
  }

  public trackMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: any) {
    try {
      // Sentry にメッセージ送信
      captureMessage(message, level, context);
      
      // Clarity にカスタムイベント記録
      clarityService.trackCustomEvent('message', {
        message,
        level,
        ...context
      });
    } catch (error) {
      console.error('Failed to track message:', error);
    }
  }

  public trackPageView(pageName: string, customData?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Page view: ${pageName}`, 'navigation', customData);
      
      // Clarity にページビュー記録
      clarityService.trackPageView(pageName, customData);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  public trackUserAction(action: string, data?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`User action: ${action}`, 'user', data);
      
      // Clarity にカスタムイベント記録
      clarityService.trackCustomEvent('user_action', {
        action,
        ...data
      });
    } catch (error) {
      console.error('Failed to track user action:', error);
    }
  }

  public trackSalesActivity(activityType: 'email' | 'form' | 'scraping', data?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Sales activity: ${activityType}`, 'business', data);
      
      // Clarity に営業活動記録
      clarityService.trackSalesActivity(activityType, data);
    } catch (error) {
      console.error('Failed to track sales activity:', error);
    }
  }

  public trackCampaign(action: 'created' | 'started' | 'completed', campaignData?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Campaign ${action}`, 'business', campaignData);
      
      // Clarity にキャンペーン記録
      clarityService.trackCampaign(action, campaignData);
    } catch (error) {
      console.error('Failed to track campaign:', error);
    }
  }

  public trackCompanyInteraction(action: 'viewed' | 'edited' | 'deleted', companyData?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Company ${action}`, 'business', companyData);
      
      // Clarity に企業インタラクション記録
      clarityService.trackCompanyInteraction(action, companyData);
    } catch (error) {
      console.error('Failed to track company interaction:', error);
    }
  }

  public trackPerformance(metric: string, value: number, additionalData?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Performance: ${metric} = ${value}`, 'performance', additionalData);
      
      // Clarity にパフォーマンス記録
      clarityService.trackPerformance(metric, value, additionalData);
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  }

  public trackUserJourney(step: string, data?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Journey: ${step}`, 'journey', data);
      
      // Clarity にユーザージャーニー記録
      clarityService.trackUserJourney(step, data);
    } catch (error) {
      console.error('Failed to track user journey:', error);
    }
  }

  public trackFormSubmit(formName: string, formData?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Form submit: ${formName}`, 'user', formData);
      
      // Clarity にフォーム送信記録
      clarityService.trackFormSubmit(formName, formData);
    } catch (error) {
      console.error('Failed to track form submit:', error);
    }
  }

  public trackClick(elementName: string, additionalData?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`Click: ${elementName}`, 'user', additionalData);
      
      // Clarity にクリック記録
      clarityService.trackClick(elementName, additionalData);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  }

  public trackABTest(testName: string, variant: string, data?: any) {
    try {
      // Sentry にパンくず追加
      addBreadcrumb(`A/B Test: ${testName} = ${variant}`, 'experiment', data);
      
      // Clarity にA/Bテスト記録
      clarityService.trackABTest(testName, variant, data);
    } catch (error) {
      console.error('Failed to track A/B test:', error);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const monitoring = MonitoringService.getInstance();