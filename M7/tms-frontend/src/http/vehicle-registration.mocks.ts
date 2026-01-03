const powiatPrefixes = [
  // podlaskie
  'BI',  'BS',  'BL',  'BAU', 'BIA', 'BBI', 'BGR', 'BHA', 'BKL', 'BMN', 'BSE', 'BSI', 'BSK', 'BSU', 'BWM', 'BZA', 'BLM',
  // kujawsko-pomorskie
  'CB',  'CG',  'CT',  'CW',  'CAL', 'CBR', 'CBY', 'CCH', 'CGD', 'CGR', 'CIN', 'CLI', 'CMG', 'CNA', 'CRA', 'CRY', 'CSE', 'CSW', 'CTR', 'CTU', 'CWA', 'CWL', 'CZN',
  // dolnośląskie
  'DJ',  'DL',  'DB',  'DW',  'DBL', 'DDZ', 'DGR', 'DGL', 'DJA', 'DJE', 'DKA', 'DKL', 'DLE', 'DLB', 'DLU', 'DLW', 'DMI', 'DOL', 'DOA', 'DPL', 'DSR', 'DST', 'DSW', 'DTR', 'DBA', 'DWL', 'DWR', 'DZA', 'DZG', 'DZL',
  // łódzkie
  'EP',  'ES', 'EL',  'EBE', 'EBR', 'EKU', 'EOP', 'EPA', 'EPJ', 'EPI', 'EPD', 'ERA', 'ERW', 'ESI', 'ESK', 'ETM', 'EWI', 'EWE', 'EZD', 'EZG', 'ELA', 'ELE', 'ELW', 'ELC',
  // lubuskie
  'FG',  'FZ',  'FGW', 'FKR', 'FMI', 'FNW', 'FSD', 'FSU', 'FSW', 'FSL', 'FWS', 'FZG', 'FZA', 'FZI',
  // pomorskie
  'GD',  'GA', 'GSP', 'GS',  'GBY', 'GCH', 'GCZ', 'GDA', 'GKA', 'GKS', 'GKW', 'GLE', 'GMB', 'GND', 'GPU', 'GST', 'GSZ', 'GSL', 'GTC', 'GWE', 'GWO',
  // małopolskie
  'KR',  'KK',  'KN',  'KT',  'KBC', 'KBA', 'KBR', 'KCH', 'KDA', 'KGR', 'KRA', 'KLI', 'KMI', 'KMY', 'KNS', 'KNT', 'KOL', 'KOS', 'KPR', 'KSU', 'KTA', 'KTT', 'KWA', 'KWI',
  // lubelskie
  'LB',  'LC',  'LU', 'LZ',  'LBI', 'LBL', 'LCH', 'LHR', 'LJA', 'LKR', 'LKS', 'LLB', 'LUB', 'LOP', 'LPA', 'LPU', 'LRA', 'LRY', 'LSW', 'LTM', 'LWL', 'LZA', 'LLE', 'LLU',
  // warmińsko-mazurskie
  'NE',  'NO',  'NBA', 'NBR', 'NDZ', 'NEB', 'NEL', 'NGI', 'NGO', 'NIL', 'NKE', 'NLI', 'NMR', 'NNI', 'NNM', 'NOE', 'NOL', 'NOS', 'NPI', 'NSZ', 'NWE',
  // opolskie  
  'OP',  'OB',  'OGL', 'OK',  'OKL', 'OKR', 'ONA', 'ONY', 'OOL', 'OPO', 'OPR', 'OST',
  // wielkopolskie
  'PK',  'PN',  'PL',  'PO', 'PY',  'PCH', 'PCT', 'PGN', 'PGS', 'PGO', 'PJA', 'PKA', 'PKE', 'PKL', 'PKN', 'PKS', 'PKR', 'PLE', 'PMI', 'PNT', 'POB', 'POS', 'POT', 'PP',  'PPL', 'PZ',  'PRA', 'PSR', 'PSE', 'PSZ', 'PSL', 'PTU', 'PWA', 'PWL', 'PWR', 'PZL',
  // podkarpackie
  'RK',  'RP',  'RZ',  'RT',  'RBI', 'RBR', 'RDE', 'RJA', 'RJS', 'RKL', 'RKR', 'RLS', 'RLE', 'RLU', 'RMI', 'RNI', 'RPR', 'RPZ', 'RRS', 'RZE', 'RSA', 'RST', 'RSR', 'RTA', 'RLA',
  // śląskie
  'SB',  'SY',  'SH',  'SC',  'SD', 'SG',  'SJZ', 'SJ',  'SK',  'SM', 'SPI', 'SL',  'SR',  'SI',  'SO', 'SW',  'ST',  'SZ',  'SZO', 'SBE', 'SBI', 'SBL', 'SCI', 'SCZ', 'SGL', 'SKL', 'SLU', 'SMI', 'SMY', 'SPS', 'SRC', 'SRB', 'STA', 'SWD', 'SWZ', 'SZA', 'SZY',
  // świętokrzyskie
  'TK',  'TBU', 'TJE', 'TKA', 'TKI', 'TKN', 'TOP', 'TOS', 'TPI', 'TSA', 'TSK', 'TST', 'TSZ', 'TLW',
  // mazowieckie
  'WO',  'WP',  'WR',  'WS',  'WB',  'WA',  'WD', 'WE',  'WU',  'WH',  'WF',  'WW',  'WI',  'WJ', 'WK',  'WN',  'WT',  'WX',  'WY',  'WBR', 'WCI', 'WG',  'WGS', 'WGM', 'WGR', 'WKZ', 'WL',  'WLI', 'WMA', 'WM',  'WML', 'WND', 'WOR', 'WOS', 'WOT', 'WPI', 'WPR', 'WPP', 'WPS', 'WPZ', 'WPY', 'WPU', 'WPL', 'WPN', 'WRA', 'WSI', 'WSE', 'WSC', 'WSK', 'WSZ', 'WZ',  'WWE', 'WWL', 'WV',  'WWY', 'WZU', 'WZW', 'WZY', 'WLS',
  // zachodniopomorskie
  'ZK', 'ZSW', 'ZS', 'ZZ', 'ZBI', 'ZCH', 'ZDR', 'ZGL', 'ZGY', 'ZGR', 'ZKA', 'ZKO', 'ZKL', 'ZMY', 'ZPL', 'ZPY', 'ZST', 'ZSD', 'ZSZ', 'ZSL', 'ZWA', 'ZLO',
];

function generateRegistrationSuffix() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const length = Math.random() < 0.5 ? 4 : 5;
  let result = "";
  result += digits[Math.floor(Math.random() * digits.length)];
  for (let i = 1; i < length; i++) {
    if (Math.random() < 0.5) {
      result += chars[Math.floor(Math.random() * chars.length)];
    } else {
      result += digits[Math.floor(Math.random() * digits.length)];
    }
  }
  return result;
}

export function generateRandomPolishRegistration() {
  const prefix = powiatPrefixes[Math.floor(Math.random() * powiatPrefixes.length)];
  const suffix = generateRegistrationSuffix();
  return `${prefix} ${suffix}`;
}
