// Sentryパッケージがインストールされていない場合はスキップ
const hasSentry = false;

export const initSentry = () => {
  if (!hasSentry) {
    console.warn('Sentry is not installed, skipping initialization');
    return;
  }
  
  // Sentry initialization code would go here
  console.log('Sentry initialized');
};

export const captureException = (error: Error, context?: any) => {
  if (!hasSentry) {
    console.error('Error captured:', error.message, context);
    return;
  }
  
  // Sentry error capture would go here
  console.error('Error captured:', error.message, context);
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: any) => {
  if (!hasSentry) {
    console.log(`[${level}] ${message}`, context);
    return;
  }
  
  // Sentry message capture would go here
  console.log(`[${level}] ${message}`, context);
};

export const setUser = (user: { id: string; email: string; name?: string }) => {
  if (!hasSentry) {
    console.log('User set:', user);
    return;
  }
  
  // Sentry user setting would go here
  console.log('User set:', user);
};

export const addBreadcrumb = (message: string, category: string, data?: any) => {
  if (!hasSentry) {
    console.log(`Breadcrumb [${category}]: ${message}`, data);
    return;
  }
  
  // Sentry breadcrumb would go here
  console.log(`Breadcrumb [${category}]: ${message}`, data);
};

export const startTransaction = (name: string, op: string) => {
  if (!hasSentry) {
    console.log(`Transaction started: ${name} (${op})`);
    return null;
  }
  
  // Sentry transaction would go here
  console.log(`Transaction started: ${name} (${op})`);
  return null;
};

export const withSentryConfig = (config: any) => {
  if (!hasSentry) {
    return config;
  }
  
  // Sentry config would go here
  return config;
};