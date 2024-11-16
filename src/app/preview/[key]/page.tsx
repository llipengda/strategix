import { generateSignedUrl } from '@/lib/b2'

const Page: React.FC<PageProps> = async ({ params }) => {
  const key = (await params)?.key as string
  const signedUrl = await generateSignedUrl(key)

  const isImage =
    key.endsWith('.png') || key.endsWith('.jpg') || key.endsWith('.jpeg')

  const isPdf = key.endsWith('.pdf')

  const isOffice =
    key.endsWith('.doc') ||
    key.endsWith('.docx') ||
    key.endsWith('.xls') ||
    key.endsWith('.xlsx') ||
    key.endsWith('.ppt') ||
    key.endsWith('.pptx')

  return (
    <>
      {isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/download/${key}`} alt={key} />
      )}
      {isPdf && (
        <iframe
          src={`/api/download/${key}?noRedirect=true&noDownload=true`}
          className='w-screen h-screen'
          title={key}
        />
      )}
      {isOffice && (
        <iframe
          src={`http://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
            `${process.env.DEPLOY_URL}/api/download/${key}?noRedirect=true&noDownload=true`
          )}`}
          className='w-screen h-screen'
          title={key}
        />
      )}
      {!isImage && !isPdf && !isOffice && (
        <a
          href={signedUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:underline'
        >
          下载 {key}
        </a>
      )}
    </>
  )
}

export default Page
