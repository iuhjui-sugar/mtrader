
export type MiniAppSession = {
    // 微信平台开放编号
    openid : string,
    // 会话密钥
    session_key : string,
    // 微信平台唯一编号
    unionid : string,
};

export type MiniAppOpenData = {
    // 微信平台唯一编号
    unionId : string,
    // 用户头像
    avatarUrl : string,
    // 用户昵称
    nickName : string,
};
