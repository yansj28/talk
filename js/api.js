var API = (function(){
    const BASE_URL = 'http://study.duyiedu.com';
const TOKEN_KEY = 'token';

function get(path){
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if(token){
       headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path,{headers});
}

function post(path,bodyObj){
    const headers = {
        'content-type': 'application/json',
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if(token){
        headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path,{
        headers,
        method: 'POST',
        body:JSON.stringify(bodyObj)
    });
}

async function reg(userInfo){
    const resp = await post('/api/user/reg',userInfo);
    return await resp.json();//响应体
} 

async function login(loginInfo){
    const resp = await post('/api/user/login',loginInfo);
    const result = await resp.json();
    if(result.code === 0){
        //登陆成功则保存令牌
        const token = resp.headers.get('authorization');
        localStorage.setItem(TOKEN_KEY,token);
    }
    return result;
}

async function exists(loginId){
    const resp = await get('/api/user/exists?loginId=' + loginId);
    return await resp.json();
}//验证

async function profile(){
    const resp = await get('/api/user/profile');
    return await resp.json();
}//得到当前登录用户信息

async function sendChat(content){
    const resp = await post('/api/chat',{content});
    return await resp.json();
}

async function getHistory(){
    const resp = await get('/api/chat/history');
    return await resp.json();
}

//退出登录
function loginOut(){
    localStorage.removeItem(TOKEN_KEY);
}

return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
}
})()
