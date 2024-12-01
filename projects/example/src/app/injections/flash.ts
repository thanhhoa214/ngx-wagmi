import { signal } from '@angular/core';

export const injectFlash = () => {
  const flashing = signal(false);
  const flash = (s = 1) => {
    flashing.set(true);
    setTimeout(() => flashing.set(false), s * 1000);
  };
  return { flashing, flash };
};
