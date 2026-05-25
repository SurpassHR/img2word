import {
  Document,
  Packer,
  Paragraph,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  PageBreak,
  WidthType,
  AlignmentType,
} from 'docx'

const A4_WIDTH_TWIPS = 11906
const A4_HEIGHT_TWIPS = 16838
const MARGIN_TWIPS = 1440
const USABLE_WIDTH_TWIPS = A4_WIDTH_TWIPS - 2 * MARGIN_TWIPS
const USABLE_HEIGHT_TWIPS = A4_HEIGHT_TWIPS - 2 * MARGIN_TWIPS
const CELL_GAP_TWIPS = 200
const TWIPS_PER_EMU = 635

export interface ProcessedImage {
  dataUrl: string
  width: number
  height: number
}

/** 将图片按 imagesPerPage 分组，按网格排版生成 A4 docx，返回 Blob */
export async function generateDocx(
  images: ProcessedImage[],
  imagesPerPage: number,
): Promise<Blob> {
  const pages = chunkArray(images, imagesPerPage)

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: A4_WIDTH_TWIPS, height: A4_HEIGHT_TWIPS },
            margin: {
              top: MARGIN_TWIPS,
              right: MARGIN_TWIPS,
              bottom: MARGIN_TWIPS,
              left: MARGIN_TWIPS,
            },
          },
        },
        children: pages.flatMap((pageImages, i) => {
          const children: (Table | Paragraph)[] = [buildPageTable(pageImages)]
          if (i < pages.length - 1) {
            children.push(new Paragraph({ children: [new PageBreak()] }))
          }
          return children
        }),
      },
    ],
  })

  return Packer.toBlob(doc)
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

function getGrid(count: number): { cols: number; rows: number } {
  switch (count) {
    case 1: return { cols: 1, rows: 1 }
    case 2: return { cols: 1, rows: 2 }
    case 4: return { cols: 2, rows: 2 }
    case 6: return { cols: 3, rows: 2 }
    default: return { cols: 1, rows: count }
  }
}

function buildPageTable(images: ProcessedImage[]): Table {
  const { cols, rows } = getGrid(images.length)
  const cellWidth = Math.floor(
    (USABLE_WIDTH_TWIPS - (cols - 1) * CELL_GAP_TWIPS) / cols,
  )
  const cellHeight = Math.floor(
    (USABLE_HEIGHT_TWIPS - (rows - 1) * CELL_GAP_TWIPS) / rows,
  )
  const cellWidthEmu = cellWidth * TWIPS_PER_EMU
  const cellHeightEmu = cellHeight * TWIPS_PER_EMU

  const tableRows: TableRow[] = []
  let imgIndex = 0

  for (let r = 0; r < rows; r++) {
    const cells: TableCell[] = []
    for (let c = 0; c < cols; c++) {
      const img = imgIndex < images.length ? images[imgIndex++] : null
      cells.push(
        new TableCell({
          width: { size: cellWidth, type: WidthType.DXA },
          children: img
            ? [buildImageParagraph(img, cellWidthEmu, cellHeightEmu)]
            : [new Paragraph('')],
        }),
      )
    }
    tableRows.push(new TableRow({ children: cells }))
  }

  return new Table({
    width: { size: USABLE_WIDTH_TWIPS, type: WidthType.DXA },
    rows: tableRows,
  })
}

function buildImageParagraph(
  img: ProcessedImage,
  maxWidthEmu: number,
  maxHeightEmu: number,
): Paragraph {
  const { width, height } = fitEmu(img.width, img.height, maxWidthEmu, maxHeightEmu)
  const base64 = img.dataUrl.split(',')[1]

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({
        type: 'png',
        data: base64,
        transformation: { width, height },
      }),
    ],
  })
}

function fitEmu(
  imgWidth: number,
  imgHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  let w = maxWidth
  let h = Math.round(w * imgHeight / imgWidth)
  if (h > maxHeight) {
    h = maxHeight
    w = Math.round(h * imgWidth / imgHeight)
  }
  return { width: w, height: h }
}
