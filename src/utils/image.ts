/**
 * 图片处理工具：把用户上传的图片压缩成 dataURL，
 * 避免直接存原图撑爆 localStorage
 */
export function readImageAsDataUrl(file: File, maxWidth = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error('图片解码失败'));
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext('2d');
        if (!context) {
          resolve(String(reader.result));
          return;
        }

        // 铺白底，避免透明 PNG 转 JPEG 后变黑
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}