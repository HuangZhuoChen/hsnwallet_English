var rootaddr = "";

//注册登录
export const register = rootaddr + '/app/user/register'; //注册
export const login = rootaddr + '/app/user/login'; //登录
export const resetPassword = rootaddr + '/app/user/password/reset'; //修改登录密码
export const forgetPassword = rootaddr + '/app/user/password/forget'; //忘记登录密码
export const sendVerify = rootaddr + '/app/verify/sendVerify'; //获取短信验证码
export const findUserInfo = rootaddr + '/app/user/info/detail'; //查询当前登录用户信息

//交易
export const existTradePassword = rootaddr + '/app//user/trade/password/exist'; //是否设置了交易密码
export const setTradePassword = rootaddr + '/app/user/trade/pasword'; //设置交易密码
export const resetTradePassword = rootaddr + '/app/user/reset/trade/pasword'; //修改交易密码
export const forgetPayPassword = rootaddr + '/app/user/forget/trade/pasword'; //忘记交易密码
export const kapimg = rootaddr + '/app/captcha.jpg'; //获取图形验证码
export const kapimgVerify = rootaddr + '/app/validate/captcha'; //验证图形验证码

export const payPasswordVerify = rootaddr + '/app/user/payPasswordVerify'; //验证交易密码

//个人
export const setnickname = rootaddr + '/app/user/nickname'; //修改昵称 
export const setteamname = rootaddr + '/app/user/teamname'; //修改队名 
export const setVam = rootaddr + '/app/user/cancelprotocol'; //取消对赌协议 
export const realNameAuthentication = rootaddr + '/app/user/id/authentication'; //实名认证
export const checkauthentication = rootaddr + '/app/user/check/authentication'; //查询实名认证

//首页
export const mininginfo = rootaddr + '/app/user/mining/info'; //赛季个人积分排名
export const seasonrank = rootaddr + '/app/user/season/rank'; //赛季个人积分排名
export const teamrank = rootaddr + '/app/user/team/rank'; //团队积分排名 
export const latestnumber = rootaddr + '/app/issue/latest/number'; //团队积分排名

//钱包
export const wallet = rootaddr + '/app/user/wallet'; //我的钱包
export const inoutorder = rootaddr + '/app/user/inout/order'; //充提记录
export const dailypayback = rootaddr + '/app/user/dailypayback/list'; //返回记录
export const assets_withdraw = rootaddr + '/app/user/withdraw'; //币种提现
export const cancel_order = rootaddr + '/app/user/out/cancel'; //取消提现订单

export const exchangeRate = rootaddr + '/app/coininfo/ExchangeRate'; //usdt兑换hsn汇率
export const usdtToHsn = rootaddr + '/app/user/charge/usdt'; //usdt转换成hsn
export const rechargeLog = rootaddr + '/app/user/recharge/log'; //usdt兑换hsn记录
export const insidetransfer = rootaddr + '/app/user/insidetransfer'; //站内转账
export const linkList = rootaddr+'/app/user/link/list'; //站内联系人列表
export const insertAdd = rootaddr+'/app/user/link/insert'; //新增站内联系人
export const linkDel = rootaddr+'/app/user/link/delete'; //删除站内联系人

export const addressList = rootaddr+'/app/user/coinaccount/list'; //提现地址列表；
export const addressAdd = rootaddr+'/app/user/coinaccount/add'; //新增提现地址；
export const addressDel = rootaddr+'/app/user/coinaccount/del'; //删除提现地址；

export const announcement = rootaddr + '/app/announcement'; //公告列表
//节点
export const usernode = rootaddr + '/app/user/node'; //个人节点
export const detailnode = rootaddr + '/app/user/node/detail'; //个人节点详情
export const nodeList = rootaddr + '/app/node/nodelist'; //节点信息列表
export const nodeIssue = rootaddr + '/app/issue/latest'; //节点信息
export const tradePass = rootaddr + '/app/user/buy/node'; //购买节点
export const decisionjudge = rootaddr + '/app/user/buy/decision/judge'; //节点是否可购买
export const purchaseProgress = rootaddr + '/app/RateOfOgress'; //购买进度查询

//我的邀请
export const friendList = rootaddr + '/app/user/invite/friend/list'; //我的好友

//系统版本升级更新
export const upgrade = rootaddr + '/upgrade';
export const upgradeApp = rootaddr + '/app/upgradeApp';
export const sysNotificationList = rootaddr + '/news/sysNotificationList';
export const getAppConfig = rootaddr + '/config/configlist';// 获取系统配置 
export const newAnnouncement = rootaddr + '/app/announcement/newest';// 获取最新一条公告

