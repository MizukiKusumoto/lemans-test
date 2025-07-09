declare global {
  interface Window {
    clarity: any;
  }
}

export const initClarity = () => {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  
  if (!projectId) {
    console.warn('Microsoft Clarity project ID not found');
    return;
  }

  // Microsoft Clarity tracking code
  (function(c: any, l: any, a: any, r: any, i: any) {
    c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
    const t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);
};

export const clarityService = {
  // カスタムイベントの追跡
  trackCustomEvent: (eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName, data);
    }
  },

  // ユーザー識別
  identifyUser: (userId: string, traits?: { [key: string]: any }) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('identify', userId, traits);
    }
  },

  // ページビューの追跡
  trackPageView: (pageName: string, customData?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'page_view', {
        page_name: pageName,
        ...customData
      });
    }
  },

  // クリックイベントの追跡
  trackClick: (elementName: string, additionalData?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'click', {
        element: elementName,
        timestamp: new Date().toISOString(),
        ...additionalData
      });
    }
  },

  // フォーム送信の追跡
  trackFormSubmit: (formName: string, formData?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'form_submit', {
        form_name: formName,
        timestamp: new Date().toISOString(),
        ...formData
      });
    }
  },

  // エラーイベントの追跡
  trackError: (errorType: string, errorMessage: string, additionalData?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'error', {
        error_type: errorType,
        error_message: errorMessage,
        timestamp: new Date().toISOString(),
        ...additionalData
      });
    }
  },

  // 営業活動の追跡
  trackSalesActivity: (activityType: 'email' | 'form' | 'scraping', data?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'sales_activity', {
        activity_type: activityType,
        timestamp: new Date().toISOString(),
        ...data
      });
    }
  },

  // キャンペーンの追跡
  trackCampaign: (action: 'created' | 'started' | 'completed', campaignData?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'campaign', {
        action,
        timestamp: new Date().toISOString(),
        ...campaignData
      });
    }
  },

  // 企業データの追跡
  trackCompanyInteraction: (action: 'viewed' | 'edited' | 'deleted', companyData?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'company_interaction', {
        action,
        timestamp: new Date().toISOString(),
        ...companyData
      });
    }
  },

  // パフォーマンス指標の追跡
  trackPerformance: (metric: string, value: number, additionalData?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'performance', {
        metric,
        value,
        timestamp: new Date().toISOString(),
        ...additionalData
      });
    }
  },

  // ユーザージャーニーの追跡
  trackUserJourney: (step: string, data?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'user_journey', {
        step,
        timestamp: new Date().toISOString(),
        ...data
      });
    }
  },

  // A/Bテスト結果の追跡
  trackABTest: (testName: string, variant: string, data?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'ab_test', {
        test_name: testName,
        variant,
        timestamp: new Date().toISOString(),
        ...data
      });
    }
  },

  // セッション品質の追跡
  trackSessionQuality: (score: number, factors?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'session_quality', {
        score,
        factors,
        timestamp: new Date().toISOString()
      });
    }
  }
};