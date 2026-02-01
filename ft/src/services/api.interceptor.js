import { authService } from './api';

class ApiInterceptor {
  constructor() {
    this.refreshing = false;
    this.queue = [];
  }

  async handleResponse(response) {
    if (response.status === 401) {
      return await this.handle401(response);
    }
    return response;
  }

  async handle401(failedResponse) {
    if (this.refreshing) {
      return new Promise((resolve) => {
        this.queue.push(resolve);
      }).then(() => {
        return fetch(failedResponse.url, failedResponse.options);
      });
    }

    this.refreshing = true;
    
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshResponse = await authService.refreshToken();
      
      if (refreshResponse.access_token) {
        localStorage.setItem('access_token', refreshResponse.access_token);
        if (refreshResponse.refresh_token) {
          localStorage.setItem('refresh_token', refreshResponse.refresh_token);
        }
        
        // Retry all queued requests
        this.queue.forEach(resolve => resolve());
        this.queue = [];
        
        // Retry the original request
        const newResponse = await fetch(failedResponse.url, {
          ...failedResponse.options,
          headers: {
            ...failedResponse.options.headers,
            'Authorization': `Bearer ${refreshResponse.access_token}`
          }
        });
        
        return newResponse;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
      throw error;
    } finally {
      this.refreshing = false;
    }
  }
}

export const apiInterceptor = new ApiInterceptor();
export default apiInterceptor;