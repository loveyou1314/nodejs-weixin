# 域名、服务器及 ngrok 环境配置

购买域名和服务器，不然只是自己自嗨。

## 如何让**外网**访问你的**本机**？

答案就是 **ngrok**。

### 常见交互流程

微信 - 微信的服务器 - 你的域名的服务器

### 内网穿透

![ngrok](assets/ngrok.png)

流程：微信 - 微信的服务器 - 内网穿透的域名的服务器 - 内网穿透工具通道 - 本地代理服务

1.本地起个服务

```js
python -m SimpleHTTPServer 3100
```

2.localtunnel 穿透（花生壳、[ngrok][]）

```js
./ngrok http 3100
```

3.换个网络，是不是可以查看了

[ngrok]: https://ngrok.com/
