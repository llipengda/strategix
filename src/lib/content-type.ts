export default function getContentType(fileName: string): string {
  const lowerCaseFileName = fileName.toLowerCase()

  if (lowerCaseFileName.endsWith('.xlsx')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  } else if (lowerCaseFileName.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  } else if (lowerCaseFileName.endsWith('.pptx')) {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  } else if (lowerCaseFileName.endsWith('.doc')) {
    return 'application/msword'
  } else if (lowerCaseFileName.endsWith('.xls')) {
    return 'application/vnd.ms-excel'
  } else if (lowerCaseFileName.endsWith('.ppt')) {
    return 'application/vnd.ms-powerpoint'
  } else if (lowerCaseFileName.endsWith('.rtf')) {
    return 'application/rtf'
  } else if (lowerCaseFileName.endsWith('.jpg')) {
    return 'image/jpg'
  } else if (lowerCaseFileName.endsWith('.jpeg')) {
    return 'image/jpeg'
  } else if (lowerCaseFileName.endsWith('.png')) {
    return 'image/png'
  } else if (lowerCaseFileName.endsWith('.gif')) {
    return 'image/gif'
  } else if (lowerCaseFileName.endsWith('.bmp')) {
    return 'image/bmp'
  } else if (lowerCaseFileName.endsWith('.tif')) {
    return 'image/tif'
  } else {
    return 'application/octet-stream'
  }
}
