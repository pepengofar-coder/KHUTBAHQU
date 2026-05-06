/**
 * KhutbahQu — Data Utama Khutbah
 * File ini mengagregasi semua khutbah dari file parts
 * dan mengekspor CATEGORIES, TYPES, serta khutbahList
 */

// Re-export CATEGORIES dan TYPES dari header
export { CATEGORIES, TYPES } from './parts/header.js';

// Import semua khutbah dari parts
import { k1 } from './parts/k1.js';
import { k2 } from './parts/k2.js';
import { k3, k4 } from './parts/k3k4.js';
import { k5, k6 } from './parts/k5k6.js';
import { k7, k8 } from './parts/k7k8.js';
import { k9, k10 } from './parts/k9k10.js';
import { k11, k12 } from './parts/k11k12.js';
import { k13, k14 } from './parts/k13k14.js';
import { k15, k16 } from './parts/k15k16.js';
import { k17, k18 } from './parts/k17k18.js';
import { k19, k20 } from './parts/k19k20.js';
import { k21, k22 } from './parts/k21k22.js';
import { k23, k24 } from './parts/k23k24.js';
import { k25, k26 } from './parts/k25k26.js';
import { k27, k28 } from './parts/k27k28.js';
import { k29, k30 } from './parts/k29k30.js';
import { k31, k32 } from './parts/k31k32.js';

// Agregasi semua khutbah (32 naskah lengkap)
export const khutbahList = [
  k1, k2, k3, k4, k5, k6, k7, k8, k9, k10,
  k11, k12, k13, k14, k15, k16, k17, k18, k19, k20,
  k21, k22, k23, k24, k25, k26, k27, k28, k29, k30,
  k31, k32,
];
