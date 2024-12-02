import { Component, computed, input, signal } from '@angular/core';
import QRCodeUtil, { create } from 'qrcode';

type DotCommonProps = {
  id: string;
  fill: string;
};

type RectDot = DotCommonProps & {
  type: 'rect';
  height: number;
  width: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
};

type CircleDot = DotCommonProps & {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
};

type Dot = RectDot | CircleDot;

const generateMatrix = (value: string, errorCorrectionLevel: QRCodeUtil.QRCodeErrorCorrectionLevel): boolean[][] => {
  const arr = Array.prototype.slice.call(create(value, { errorCorrectionLevel }).modules.data, 0);
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows: boolean[][], key: boolean, index: number) =>
      (index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
    [],
  );
};

@Component({
  selector: 'app-qrcode',
  template: `
    <div class="select-none" [style.height.px]="size()" [style.width.px]="size()">
      <div class="relative flex justify-center h-0" [style.width.px]="size()" [style.top.px]="logoPosition()">
        <img
          [src]="logoUrl()"
          [style.backgroundColor]="logoBackground()"
          [height]="logoSize()"
          [width]="logoSize()"
          [style.height.px]="logoSize()"
          [style.width.px]="logoSize()"
          class="rounded-base aspect-square" />
      </div>
      <svg [attr.height]="size()" [attr.width]="size()" style="all: revert;">
        <title>QR Code</title>
        <defs>
          <clipPath id="clip-wrapper">
            <rect [attr.height]="logoWrapperSize()" [attr.width]="logoWrapperSize()" />
          </clipPath>
          <clipPath id="clip-logo">
            <rect [attr.height]="logoSize()" [attr.width]="logoSize()" />
          </clipPath>
        </defs>
        <rect fill="transparent" [attr.height]="size()" [attr.width]="size()" />
        @for (dot of dots(); track dot.id) {
          @if (dot.type === 'rect') {
            <rect
              [attr.x]="dot.x"
              [attr.y]="dot.y"
              [attr.width]="dot.width"
              [attr.height]="dot.height"
              [attr.fill]="dot.fill"
              [attr.rx]="dot.rx"
              [attr.ry]="dot.ry"></rect>
          }
          @if (dot.type === 'circle') {
            <circle [attr.cx]="dot.cx" [attr.cy]="dot.cy" [attr.r]="dot.r" [attr.fill]="dot.fill"></circle>
          }
        }
      </svg>
    </div>
  `,
  standalone: true,
  host: { class: 'block w-max px-2 mx-auto' },
})
export class QRCodeComponent {
  readonly uri = input.required<string>();
  readonly ecl = input<QRCodeUtil.QRCodeErrorCorrectionLevel>('M');
  readonly logoBackground = input<string>('#ffffff');
  readonly logoMargin = input(10);
  readonly logoSize = input(50);
  readonly logoUrl = input<string>();
  readonly sizeProp = input(280);

  private padding = signal<number>(10);

  size = computed(() => this.sizeProp() - this.padding() * 2);
  logoWrapperSize = computed(() => this.logoSize() + this.logoMargin() * 2);
  logoPosition = computed(() => this.size() / 2 - this.logoSize() / 2);

  dots = computed(() => {
    const matrix = generateMatrix(this.uri(), this.ecl());
    const cellSize = this.size() / matrix.length;
    const qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    const dots: Array<Dot> = [];

    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i++) {
        dots.push({
          id: `${x}-${y}-${i}`,
          type: 'rect',
          fill: i % 2 !== 0 ? 'white' : 'black',
          height: cellSize * (7 - i * 2),
          width: cellSize * (7 - i * 2),
          x: x1 + cellSize * i,
          y: y1 + cellSize * i,
          rx: (i - 2) * -5 + (i === 0 ? 2 : 0),
          ry: (i - 2) * -5 + (i === 0 ? 2 : 0),
        });
      }
    });

    const clearArenaSize = Math.floor((this.logoSize() + 25) / cellSize);
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell) {
          const inClearArea =
            i > matrixMiddleStart && i < matrixMiddleEnd && j > matrixMiddleStart && j < matrixMiddleEnd;
          if (
            !((i < 7 && j < 7) || (i > matrix.length - 8 && j < 7) || (i < 7 && j > matrix.length - 8) || inClearArea)
          ) {
            const cx = i * cellSize + cellSize / 2;
            const cy = j * cellSize + cellSize / 2;
            const r = cellSize / 3;
            dots.push({
              id: `${cx}-${cy}-${r}-${i}`,
              type: 'circle',
              cx,
              cy,
              fill: 'black',
              r,
            });
          }
        }
      });
    });

    return dots;
  });
}
