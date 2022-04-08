<template>
  <div>This is axios</div>
</template>
<script>
import axios from 'axios'
export default {
  created() {
    // const url = "https://test.youbaobao.xyz:18081/book/home/v2";
    // axios
    //   .get(url, {
    //     params: { openId: "123456789" },
    //     headers: { token: "2020/6/12" }
    //   })
    //   .then(respones => {   //成功200请求
    //     console.log(respones);
    //   }).catch(err => {    //捕获非200请求
    //       console.log(err);
    //   });

    const whiteUrl = ['/login']
    const url = '/book/home/v2'
    const request = axios.create({
      baseURL: 'https://test.youbaobao.xyz:18081',
      timeout: 5000
    })
    // axios request请求拦截器
    request.interceptors.request.use(
      config => {
        const url = config.url.replace(config.baseURL, '')
        if (whiteUrl.some(wl => url === wl)) {
          // 判断url是否在白名单当中
          return config
        } else {
          throw new Error('error...')
          config.headers['token'] = 'abcd'
          return config
        }
      },
      error => {
        console.log(error) // 捕获error
      }
    )
    // axios response响应拦截器
    // request.interceptors.response.use(
    //   response => {
    //     // console.log(response);
    //     const res = response.data;
    //     if (res.error_code != 0) {
    //       aletr(res.msg);
    //       return Promise.reject(new Error(res.msg));
    //     } else {
    //       return res;
    //     }
    //   },
    //   error => {
    //     return Promise.reject(error);
    //   }
    // );
    request({
      url,
      method: 'get',
      params: {
        openId: '1234'
      }
    })
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log('自定义错误提示') // 对捕获的error进行自定义
      })
  }
}
</script>
