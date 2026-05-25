import type { ImageEdits } from './types'

/**
 * 将 ImageEdits 中所有图像处理操作应用到图片上，
 * 返回包含处理结果的 HTMLCanvasElement。
 * 操作顺序：裁剪 → 旋转 → 颜色调整（灰度 → 亮度 → 对比度 → 反色）
 */
export function applyEdits(
  image: HTMLImageElement,
  edits: ImageEdits,
): HTMLCanvasElement {
  let canvas = cropImage(image, edits.crop)
  canvas = rotateCanvas(canvas, edits.rotation)
  applyColorAdjustments(canvas, edits)
  return canvas
}

/**
 * 便捷函数：返回处理后的 data URL 字符串，用于预览或导出。
 */
export function renderPreview(
  image: HTMLImageElement,
  edits: ImageEdits,
): string {
  return applyEdits(image, edits).toDataURL('image/png')
}

/** 将百分比裁剪区域转换为像素并绘制到新 canvas */
function cropImage(
  image: HTMLImageElement,
  crop: ImageEdits['crop'],
): HTMLCanvasElement {
  const iw = image.naturalWidth
  const ih = image.naturalHeight

  if (!crop) {
    const canvas = document.createElement('canvas')
    canvas.width = iw
    canvas.height = ih
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0)
    return canvas
  }

  const sx = (crop.x / 100) * iw
  const sy = (crop.y / 100) * ih
  const sw = (crop.width / 100) * iw
  const sh = (crop.height / 100) * ih

  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh)
  return canvas
}

/** 按 0/90/180/270 度旋转 canvas，返回新 canvas（0 度时原地返回） */
function rotateCanvas(
  source: HTMLCanvasElement,
  rotation: ImageEdits['rotation'],
): HTMLCanvasElement {
  if (rotation === 0) return source

  const srcW = source.width
  const srcH = source.height

  const swapped = rotation === 90 || rotation === 270
  const outW = swapped ? srcH : srcW
  const outH = swapped ? srcW : srcH

  const angleMap = {
    90: Math.PI / 2,
    180: Math.PI,
    270: (Math.PI * 3) / 2,
  } satisfies Record<typeof rotation, number>

  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')!

  ctx.translate(outW / 2, outH / 2)
  ctx.rotate(angleMap[rotation])
  ctx.drawImage(source, -srcW / 2, -srcH / 2)

  return canvas
}

/** 通过像素操作应用颜色调整（单次遍历） */
function applyColorAdjustments(
  canvas: HTMLCanvasElement,
  edits: ImageEdits,
): void {
  const { brightness, contrast, inverted, grayscale } = edits

  if (brightness === 100 && contrast === 100 && !inverted && !grayscale) return

  const ctx = canvas.getContext('2d')!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  const bFactor = brightness / 100
  const cFactor = contrast / 100

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    // 灰度：加权亮度法
    if (grayscale) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b
      r = g = b = gray
    }

    // 亮度：乘以系数
    r = clamp(r * bFactor)
    g = clamp(g * bFactor)
    b = clamp(b * bFactor)

    // 对比度：以 128 为中点缩放
    r = clamp((r - 128) * cFactor + 128)
    g = clamp((g - 128) * cFactor + 128)
    b = clamp((b - 128) * cFactor + 128)

    // 反色
    if (inverted) {
      r = 255 - r
      g = 255 - g
      b = 255 - b
    }

    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }

  ctx.putImageData(imageData, 0, 0)
}

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)))
}
