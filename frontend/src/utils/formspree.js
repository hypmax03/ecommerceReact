// Formspree Notification Service
// Endpoint provided by the user for receiving real-time alerts
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdlakzq';

/**
 * Dispatch an email notification via Formspree
 * @param {Object} payload - Notification data including event, subject, and item details
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendFormspreeNotification(payload = {}) {
  try {
    const formattedData = {
      ...payload,
      _subject: payload.subject || `[Elora Atelier Alert] ${payload.event || 'Product Notification'}`,
      timestamp: new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'UTC',
      }) + ' UTC',
      application: 'Elora Atelier Scrapbook E-Commerce',
    };

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (response.ok) {
      return { success: true };
    }

    const data = await response.json().catch(() => ({}));
    return {
      success: false,
      error: data?.error || `HTTP error ${response.status}`,
    };
  } catch (err) {
    console.error('Failed to send Formspree notification:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
