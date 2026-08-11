import { analytics as analyticsPromise } from './config';
import { logEvent, type Analytics } from 'firebase/analytics';

let analyticsInstance: Analytics | null = null;
analyticsPromise.then(a => { analyticsInstance = a; });

function log(eventName: string, params?: Record<string, unknown>) {
  if (!analyticsInstance) return;
  try {
    logEvent(analyticsInstance, eventName, params ?? {});
  } catch {
    // Analytics not available in some environments
  }
}

export const analytics = {
  pageView: (pagePath: string, pageTitle: string) =>
    log('page_view', { page_path: pagePath, page_title: pageTitle }),

  buttonClick: (buttonId: string, buttonText: string) =>
    log('button_click', { button_id: buttonId, button_text: buttonText }),

  formSubmit: (formName: string) =>
    log('form_submit', { form_name: formName }),

  donation: (amount: number, method: string) =>
    log('donation', { value: amount, currency: 'INR', method }),

  complaintSubmit: (category: string) =>
    log('complaint_submit', { category }),

  search: (term: string) =>
    log('search', { search_term: term }),

  memberJoin: () => log('member_join'),
  newsletterSubscribe: () => log('newsletter_subscribe'),
  galleryView: (itemTitle: string) => log('gallery_view', { title: itemTitle }),
  eventView: (eventTitle: string) => log('event_view', { title: eventTitle }),
  newsView: (articleTitle: string) => log('news_view', { title: articleTitle }),
};
