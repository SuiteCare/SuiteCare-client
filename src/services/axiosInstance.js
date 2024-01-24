import axios from 'axios';

const localServer = 'http://localhost:3000'; // 로컬 서버
const productServer = ''; // 실제 백엔드 서버

const axiosInstance = axios.create({
  baseURL: localServer,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const maxRetries = 3;
const retryDelay = 1000; // 1초

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // axios api를 요청했을 때, interceptor를 통해서 요청하기 전 로직을 구현하는 곳입니다.
    // jwt로 발급한 token을 가져오는 로직을 여기에 구현하면 됩니다.
    // 참고 자료: https://velog.io/@xmun74/axios-interceptors-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0

    // console.log('Starting Request', config);
    return config;
  },
  (error) => {
    // 요청 상태 코드 200이 아닌 경우
    console.error('Request Error, 요청 에러', error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 로직
    // console.log('Response:', response);
    return response;
  },
  (error) => {
    const { config, response } = error;

    // 에러 상태 코드가 재시도할만한 상태인 경우
    if (response && response.status >= 500 && response.status < 600) {
      // 재시도 횟수가 최대 횟수를 초과하지 않으면 재시도
      if (!config.__retryCount || config.__retryCount < maxRetries) {
        config.__retryCount = config.__retryCount || 0;
        config.__retryCount += 1;

        // 딜레이 후 재시도
        return new Promise((resolve) => {
          setTimeout(() => resolve(axiosInstance(config)), retryDelay);
        });
      }
    }
  },
);

export default axiosInstance;