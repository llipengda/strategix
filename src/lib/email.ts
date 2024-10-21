export const html = ({
  url,
  host,
  emailType
}: {
  url: string
  host: string
  emailType: string
}) => {
  const escapedHost = host.replace(/\./g, '&#8203;.')

  const titlePre = emailType === 'signup' ? '注册' : '登录到'
  const type = emailType === 'signup' ? '注册' : '登录'

  return `
  <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${titlePre} ${escapedHost}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        a, a:link, a:visited, a:hover, a:active{
          text-decoration: none;
          color: #ffffff !important;
        }
        .container {
          background-color: #ffffff;
          margin: 0 auto;
          padding: 20px;
          max-width: 600px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333333;
          text-align: center;
        }
        p {
          font-size: 16px;
          color: #555555;
          text-align: center;
        }
        .button {
          display: block;
          width: 100px;
          margin: 20px auto;
          padding: 15px 25px;
          font-size: 16px;
          text-align: center;
          background-color: #2563EB;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #1D4ED8;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #999999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${titlePre} ${escapedHost}</h1>
        <p>点击下方按钮来完成您的${type}：</p>
        <a href="${url}" class="button" color="#ffffff">${type}</a>
        <div class="footer">
          <p>如果您没有请求此邮件，您可以安全地忽略它。</p>
        </div>
      </div>
    </body>
  </html>`
}

export function text({
  url,
  host,
  emailType
}: {
  url: string
  host: string
  emailType: string
}) {
  return `${emailType === 'signup' ? '注册' : '登录到'} ${host}\n${url}\n\n`
}
