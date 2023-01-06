(async function(){
    const resp = await API.profile();
    const user = resp.data;
    if(!user){
        alert('未登录或登陆已过期，请重新登录');
        location.href = './login.html';
        return;
    }

    //下面的代码一定是登录状态下执行
    const doms = {
        aside:{
            nickname:$('#nickname'),
            loginId:$('#loginId'),
        },
        close:$('.close'),
        chatContainer:$('.chat-container'),
        txtMsg :$('#txtMsg'),
        form:$('.msg-container'),
    };

    setUserInfo();
    //设置id和你和昵称
    function setUserInfo(){
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    };

    //设置退出事件
    doms.close.onclick = function(){
        API.loginOut();
        location.href = './login.html';
    } 

    //添加消息
    function addChat(chatInfo){
        const div = $$$('div');
        div.classList.add('chat-item');
        if(chatInfo.from){
            div.classList.add('me');
        };

        const img = $$$('img');
        img.className = 'chat-avatar';
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';
    
        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content;

        const date = $$$('div');
        date.className = 'chat-date';
        date.innerText = dateFormat(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);

        doms.chatContainer.appendChild(div);
    }


    function dateFormat(time){
        const date = new Date(time);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    //加载历史记录
    await loadHistory();
    async function loadHistory(){
        const resp = await API.getHistory();
        for (const obj of resp.data) {
            addChat(obj);
        }
    }

    //让聊天记录滚动到底
    scrollBottom();
    function scrollBottom(){
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    //发送消息
    async function sendChat(){
        const content = doms.txtMsg.value.trim();
        if(!content){
            return;
        }

        addChat({
            from:user.loginId,
            to:null,
            createdAt: Date.now(),
            content,
        });
        doms.txtMsg.value = '';
        scrollBottom();

        const resp = await API.sendChat(content);
        addChat({
            from:null,
            to:user.loginId,
            ...resp.data,
        });
        scrollBottom();
        
    }
    window.sendChat = sendChat;

    //表单发送
    doms.form.onsubmit = function(e){
        e.preventDefault();
        sendChat();
    };
})();