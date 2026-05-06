/**
 * KhutbahQu — Data Utama Khutbah
 * Mengagregasi semua khutbah dari file parts dan mengekspor khutbahList
 */

export { CATEGORIES, TYPES } from './parts/header.js';

// Original khutbah (k1-k32)
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

// Tauhid
import { tauhid_1, tauhid_2 } from './parts/cat_tauhid_1.js';
import { tauhid_3, tauhid_4 } from './parts/cat_tauhid_2.js';
import { tauhid_5, tauhid_6 } from './parts/cat_tauhid_3.js';
import { tauhid_7, tauhid_8 } from './parts/cat_tauhid_4.js';
import { tauhid_9 } from './parts/cat_tauhid_5.js';

// Takwa
import { taqwa_1, taqwa_2 } from './parts/cat_taqwa_1.js';
import { taqwa_3, taqwa_4 } from './parts/cat_taqwa_2.js';
import { taqwa_5, taqwa_6, taqwa_7 } from './parts/cat_taqwa_3.js';

// Shalat
import { shalat_1, shalat_2 } from './parts/cat_shalat_1.js';

export const khutbahList = [
  k1, k2, k3, k4, k5, k6, k7, k8, k9, k10,
  k11, k12, k13, k14, k15, k16, k17, k18, k19, k20,
  k21, k22, k23, k24, k25, k26, k27, k28, k29, k30,
  k31, k32,
  // Tauhid
  tauhid_1, tauhid_2, tauhid_3, tauhid_4, tauhid_5, tauhid_6, tauhid_7, tauhid_8, tauhid_9,
  // Takwa
  taqwa_1, taqwa_2, taqwa_3, taqwa_4, taqwa_5, taqwa_6, taqwa_7,
  // Shalat
  shalat_1, shalat_2,
];
